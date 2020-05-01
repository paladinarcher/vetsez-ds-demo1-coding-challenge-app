class WeeklyStatusController < ApplicationController
  def index
  end

  def show
    @weekly_status = WeeklyStatus.find(params[:id])

    unless current_user.eql? @weekly_status.user

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
end
