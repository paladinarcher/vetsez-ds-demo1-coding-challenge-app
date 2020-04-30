class WeeklyStatusController < ApplicationController
  def index
  end

  def upload
    if !params[ :file ].nil?
      ws = WeeklyStatus.new
      file = params[:file]
      ws.weekly_csv.attach(io: file.tempfile, filename: file.original_filename )
      ws.user = current_user
      WeeklyStatus.transaction do
        ws.save!
        ws.local_details.each do |detail|
          detail.save!
        end
      end
    end
    redirect_to weekly_status_path
  end
end
