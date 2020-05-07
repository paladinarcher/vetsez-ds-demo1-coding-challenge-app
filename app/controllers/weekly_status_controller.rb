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
      WeeklySummary.transaction do
        @summaries.each(&:save!)
      end
    end
    # a = summaries.sort {|a,b| b.project_code.strip <=> a.project_code.strip }.map {|e| e.project_code}
    # s = WeeklyStatus.find(ws_id).weekly_summaries.order(project_code: :asc, task_number: :asc)
    @weekly_status = WeeklyStatus.find_by_id(ws_id)
    @summaries = WeeklyStatus.find(ws_id).weekly_summaries.order(project_code: :asc, task_number: :asc)
    @weekly_status.weekly_summaries = @summaries.sort do |a,b|
      a.project_code.strip <=> b.project_code.strip
    end
  end

  def update
    ws_id = params[:id]
    @weekly_status = WeeklyStatus.find_by_id(ws_id)
    if (@weekly_status.update_attributes(weekly_params))
      $log.debug("I updated the weekly summaries")
    else
      $log.error("I failed to update the weekly summaries")
    end
    @summaries = WeeklyStatus.find(ws_id).weekly_summaries.order(project_code: :desc, task_number: :asc)
    render 'weekly_status/show'
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
    params.require(:weekly_status).permit!#.permit(get_whitelist)
  end

  # def get_whitelist
  #   params_array = WeeklyStatus.column_names
  #   weekly_array = [:weekly_summaries_attributes => WeeklySummary.column_names]
  #   params_array << weekly_array
  # end

end
