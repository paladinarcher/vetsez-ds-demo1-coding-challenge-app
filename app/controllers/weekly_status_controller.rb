require './lib/unanet/unanet.rb' # move to initializer

class WeeklyStatusController < ApplicationController

  def index
    @weekly_statuses = WeeklyStatus.where('user_email = ?', current_user.email).order(week_start_date: :desc)
  end

  def show
    ws_id = params[:id]

    # if WeeklySummary.find_by_weekly_status_id(ws_id).nil?
    #   summaries = WeeklyStatus.weekly_summary(ws_id)
    #   @summaries = []
    #   summaries.each do |ws|
    #     @summaries << WeeklySummary.new(ws)
    #   end
    #   WeeklySummary.transaction do
    #     @summaries.each(&:save!)
    #   end
    # end
    @weekly_status = WeeklyStatus.find(ws_id)
  end

  def details
    ws_id = params[:id]
    @details = WeeklyStatus.find(ws_id).weekly_status_details .order(timesheet_cell_project_code: :asc, timesheet_cell_task_name: :asc, timesheet_cell_work_date: :asc)
  end

  def update
    ws_id = params[:id]
    @weekly_status = WeeklyStatus.find(ws_id)

    if (@weekly_status.update_attributes(weekly_params))
      $log.debug("I updated the weekly summaries for #{ws_id}")
    else
      $log.error("I failed to update the weekly summaries for #{ws_id}")
    end
    render 'weekly_status/show'
  end

  def magic_upload
    username = params['unanet-username-input']
    pwd = params['unanet-password-input']
    url = params['unanet-url-input']
    begin
      fetcher = Unanet::FetchSummaries.new(username, pwd)
      summaries = fetcher.get_report
    rescue => e
      $log.error(LEX('Failed to instantiate FetchSummaries', e))
      summaries = nil
    end

    @result = 'sad'
    @headers = []
    @rows = []

    if (summaries&.success)
      @result = 'happy'
      @headers = summaries.csv[summaries.csv.keys[-3]].headers
      @rows = summaries.csv[summaries.csv.keys[-3]].by_row

      summaries.csv.keys.each do |weekly_person_bucket|
        start_of_week = weekly_person_bucket.first
        start_process_date = Unanet::FetchSummaries::LOOKBACK_WEEKS.weeks.ago
        next if start_of_week < start_process_date
        next if start_of_week > Unanet.get_start_of_week(Time.now.to_date)
        email = weekly_person_bucket.last
        csv = summaries.csv[weekly_person_bucket]
        ws = WeeklyStatus.where(user_email: email, week_start_date: start_of_week).first_or_initialize
        ws.csv_magic = csv

        WeeklyStatus.transaction do
          ws.save!
          ws.local_details.each do |detail|
            detail.save!
          end
        end
      end
    end
    redirect_to weekly_status_index_path
  end


  def upload
      ws = WeeklyStatus.new

      if !params[ :file ].nil?
        file = params[:file]
        ws.weekly_csv.attach(io: file.tempfile, filename: file.original_filename )
        ws.user = current_user
        WeeklyStatus.transaction do
          ws.save!
          ws.local_details.each do |detail|
            detail.save!
          end
        end
      else
        ws = nil
      end

    if ws.nil?
      redirect_to weekly_status_path
    else
      @weekly_status = ws
      redirect_to @weekly_status
    end
  end

  private
  def weekly_params
    params.require(:weekly_status).permit(
        weekly_summaries_attributes: %w(id weekly_summary_comment blockers next_planned_activity)
        # weekly_summaries_attributes: WeeklySummary.column_names
    )
  end

  # def weekly_params
  #   this is a permit all!!
  #   params.require(:weekly_status).permit! #.permit(get_whitelist)
  # end

  # def get_whitelist
  #   params_array = WeeklyStatus.column_names
  #   weekly_array = [:weekly_summaries_attributes => WeeklySummary.column_names]
  #   params_array << weekly_array
  # end

end
