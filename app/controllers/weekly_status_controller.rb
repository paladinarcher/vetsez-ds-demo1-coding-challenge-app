class WeeklyStatusController < ApplicationController
  def index
  end

  def show
    ws_id = params[:id]
    if WeeklySummary.find_by_weekly_status_id(ws_id).nil?
      summaries = WeeklyStatus.weekly_summary(ws_id)
      @summaries = []
      summaries.each do |ws|
        @summaries << WeeklySummary.new(ws)
      end
      @summaries.each(&:save!)
    else
      @summaries = WeeklySummary.where("weekly_status_id = ?", ws_id)
    end

    @summaries
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
