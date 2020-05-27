class WeeklyStatusController < ApplicationController
  before_action :verify_user_in_role!

  def index
    @weekly_statuses = WeeklyStatus.where('user_email = ?', current_user.email).order(week_start_date: :desc)
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
      @weekly_status.reviewed_status!
      $log.debug("I updated the weekly summaries for #{ws_id}")
    else
      $log.error("I failed to update the weekly summaries for #{ws_id}")
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
