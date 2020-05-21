require './lib/unanet/unanet.rb' # move to initializer

class WeeklyStatusController < ApplicationController
  def index
    @weekly_statuses = WeeklyStatus.where('user_email = ?', current_user.email).order(week_start_date: :desc)
  end

  def show
    ws_id = params[:id]

    if WeeklySummary.find_by_weekly_status_id(ws_id).nil?
      summaries = WeeklyStatus.weekly_summary(ws_id)
      @summaries = []
      summaries.each do |ws|
        @summaries << WeeklySummary.new(ws)
      end
      $log.error(@summaries.inspect)
      WeeklySummary.transaction do
        @summaries.each(&:save!)
      end
    end
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
    fetcher = Unanet::FetchSummaries.new(user: username, password: pwd)
    summaries = fetcher.get_report
    @result = 'sad'
    @headers = []
    @rows = []

    if summaries.success
      @result = 'happy'
      @headers = summaries.csv[summaries.csv.keys[-3]].headers
      @rows = summaries.csv[summaries.csv.keys[-3]].by_row

      summaries.csv.keys.each do |weekly_bucket|
        csv = summaries.csv[weekly_bucket]
          # ws = WeeklyStatus.where(user_email: 'greg.bowman@vetsez.com', week_start_date: '').first_or_initialize

        ws = WeeklyStatus.new
        ws.user_email = 'greg.bowman@vetsez.com'
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
        weekly_summaries_attributes: %w(id reviewed weekly_summary_comment blockers next_planned_activity)
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
