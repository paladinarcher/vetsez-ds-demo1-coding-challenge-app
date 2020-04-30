class WeeklyStatusController < ApplicationController
  def index
  end

  def upload
    a = params
    if !params[ :file ].nil?
      ws = WeeklyStatus.new
      ws.weekly_csv.attach(params[:file])
      ws.user = current_user
      ws.save!
    end
    redirect_to weekly_status_path
  end
end
