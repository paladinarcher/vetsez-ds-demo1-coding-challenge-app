require './lib/unanet/unanet.rb' # move to initializer

class WeeklyStatusController < ApplicationController

  def index
    @weekly_statuses = WeeklyStatus.where('user_email = ?', current_user.email).order(week_start_date: :desc)
  end

  private def init_weekly_summary(ws_id)
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
  end

  def show
    ws_id = params[:id]

    if WeeklySummary.find_by_weekly_status_id(ws_id).nil?
      init_weekly_summary ws_id
    end
    @weekly_status = WeeklyStatus.find(ws_id)
    verify_authorized(@weekly_status.user_email)
  end

  def details
    ws_id = params[:id]
    @details = WeeklyStatus.find(ws_id).weekly_status_details.order(timesheet_cell_project_code: :asc, timesheet_cell_task_name: :asc, timesheet_cell_work_date: :asc)
    verify_authorized(@details.first.person_email_id)
  end

  def update
    ws_id = params[:id]
    @weekly_status = WeeklyStatus.find(ws_id)

    if (@weekly_status.update_attributes(weekly_params))
      $log.debug("I updated the weekly summaries for #{ws_id}")
    else
      $log.error("I failed to update the weekly summaries for #{ws_id}")
    end
    redirect_to weekly_status_index_path
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
    csv_holder = UnanetCsvUpload.new
    if !params[:file].nil?
      file = params[:file]
      csv_holder.csv_upload.attach(io: file.tempfile, filename: file.original_filename)
      csv_holder.user_email = current_user.email
      csv_holder.save!

      big_csv = csv_holder.get_csv
      buckets_of_csv = Unanet.bucket_csv big_csv
      buckets_of_csv.keys.each do |bucket|
        start_of_week = bucket.first
        email = bucket.last
        weekly_user_csv = buckets_of_csv[bucket]
        ws = WeeklyStatus.where(user_email: email, week_start_date: start_of_week).first_or_initialize
        ws.csv_data = weekly_user_csv

        WeeklyStatus.transaction do
          ws.save!
          ws.local_details.each do |detail|
            detail.save!
          end
        end
      end
    else
      flash[:alert] = "Please select a file to upload"
    end

    redirect_to weekly_status_index_path
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
