class AdminUploadController < ApplicationController
  # Check that the user has the right authorization to access clients.
  before_action :check_authorization

  def index
    @uploads = UnanetCsvUpload.all.order(created_at: :desc, end_date: :desc)
  end

  def upload
    csv_holder = UnanetCsvUpload.new
    upload_start_date, upload_end_date = nil, nil

    if !params[:file].nil?
      file = params[:file]
      csv_holder.csv_upload.attach(io: file.tempfile, filename: file.original_filename)
      csv_holder.user_email = current_user.email
      # csv_holder.save!

      big_csv = csv_holder.get_csv
      buckets_of_csv = Unanet.bucket_csv big_csv
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

        WeeklyStatus.transaction do
          ws.save!
          if ws.local_details
            ws.local_details.each do |detail|
              detail.save!
            end
          end
        end
      end

      # save the upload record
      csv_holder.start_date = upload_start_date
      csv_holder.end_date = upload_end_date
      csv_holder.save!
      flash[:notice] = "CSV uploaded successfully!"
    else
      flash[:alert] = "Please select a file to upload"
    end

    redirect_to admin_upload_index_path
  end

  private
  # If the user is not authorized, just throw the exception.
  def check_authorization
    # raise User::NotAuthorized unless current_user.has_role? Roles::RoleTags::ADMIN_ROLE cris
    unless current_user.has_role? Roles::RoleTags::ADMIN_ROLE
      flash[:error] = "You don't have access to this section."
      redirect_to root_path
    end

    # redirect_back(fallback_location: root_path)
  end
end
