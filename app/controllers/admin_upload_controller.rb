class AdminUploadController < ApplicationController
  # Check that the user has the right authorization to access clients.
  before_action :verify_user_in_role!

  index_roles(RoleTags::ADMIN_ROLE)
  def index
    @uploads = UnanetCsvUpload.all.order(created_at: :desc, end_date: :desc)
  end

  #upload_roles(RoleTags::ADMIN_ROLE, RoleTags::PM_ROLE)
  upload_roles(RoleTags::ADMIN_ROLE)
  def upload
    csv_holder = UnanetCsvUpload.new
    upload_start_date, upload_end_date = nil, nil

    if !params[:file].nil?
      file = params[:file]
      csv_holder.csv_upload.attach(io: file.tempfile, filename: file.original_filename)
      csv_holder.user_email = current_user.email

      WeeklyStatus.transaction do
        big_csv = csv_holder.get_csv
        buckets_of_csv = Unanet.trim_future(Unanet.bucket_csv big_csv)
        buckets_of_csv.keys.each do |bucket|
          start_of_week = bucket.first
          email = bucket.last
          weekly_user_csv = buckets_of_csv[bucket]

          # set the  upload_start_date and upload_end_date based on the user bucket being processed
          upload_start_date ||= start_of_week
          upload_end_date = start_of_week

          # create or update the WeeklyStatus record and their associate detail records
          ws = WeeklyStatus.where(user_email: email, week_start_date: start_of_week).first_or_initialize
          ws.csv_data = weekly_user_csv
          ws.save!
          if ws.local_details
            ws.local_details.each(&:save!)

            # create the summary record based on the newly saved details
            summaries = init_weekly_summary(ws.id)
            summaries.each(&:save!)
          end

        end
        # save the upload record
        csv_holder.start_date = upload_start_date
        csv_holder.end_date = upload_end_date
        csv_holder.save!
        flash[:notice] = "CSV uploaded successfully!"

        #  blank out the project titles and weekly start dates (used to load drop downs on pm page)
        ProjectHelper.distinct_project_titles = WeeklyStatusDetail.distinct_project_titles
        ProjectHelper.distinct_weekly_start_dates = WeeklyStatus.distinct_start_of_week(:desc)
      end
    else
      flash[:alert] = "Please select a file to upload"
    end

    redirect_to admin_upload_index_path
  end

  private

  def init_weekly_summary(ws_id)
    summaries = WeeklyStatus.weekly_summary(ws_id)
    summaries_array = []
    summaries.each do |ws|
      summaries_array << WeeklySummary.new(ws)
    end
    summaries_array
  end

=begin
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
    upload_start_date, upload_end_date = nil, nil

    if !params[:file].nil?
      file = params[:file]
      csv_holder.csv_upload.attach(io: file.tempfile, filename: file.original_filename)
      csv_holder.user_email = current_user.email

      big_csv = csv_holder.get_csv
      buckets_of_csv = Unanet.bucket_csv big_csv

      WeeklyStatus.transaction do
        buckets_of_csv.keys.each do |bucket|
          start_of_week = bucket.first
          email = bucket.last
          weekly_user_csv = buckets_of_csv[bucket]

          # set the  upload_start_date and upload_end_date based on the user bucket being processed
          upload_start_date ||= start_of_week
          upload_end_date = start_of_week

          # create or update the WeeklyStatus record and their associate detail records
          ws = WeeklyStatus.where(user_email: email, week_start_date: start_of_week).first_or_initialize
          ws.csv_data = weekly_user_csv
          ws.save!

          # save the local details todo why the if statement?
          if ws.local_details
            ws.local_details.each(&:save!)
          end

          $log.error("**********************************************")
          # create the summary record based on the newly saved details
          init_weekly_summary(ws.id)
        end

        # save the upload record
        csv_holder.start_date = upload_start_date
        csv_holder.end_date = upload_end_date
        csv_holder.save!
      end
    else
      flash[:alert] = "Please select a file to upload"
    end

    redirect_to weekly_status_index_path
  end
=end
end
