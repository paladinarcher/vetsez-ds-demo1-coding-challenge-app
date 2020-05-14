require './lib/unanet/unanet.rb' # move to initializer

class WeeklyStatusController < ApplicationController
  def index
    @weekly_statuses = WeeklyStatus.where('user_id = ? and active = true', current_user.id).order(week_start_date: :desc)
  end

  def show
    ws_id = params[:id]

    if WeeklySummary.find_by_weekly_status_id(ws_id).nil?
      summaries = WeeklyStatus.weekly_summary(ws_id)
      @summaries = []
      summaries.each do |ws|
        @summaries << WeeklySummary.new(ws)
      end
      WeeklySummary.transaction do
        @summaries.each(&:save!)
      end
    end
    @weekly_status = WeeklyStatus.find(ws_id)
  end

  def details
    ws_id = params[:id]
    @details = WeeklyStatus.find(ws_id).weekly_status_details.order(project_code: :asc, task_number: :asc, task_date: :asc)
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
      @headers = summaries.csv[summaries.csv.keys[-2]].headers
      @rows = summaries.csv[summaries.csv.keys[-2]].by_row
    end
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
