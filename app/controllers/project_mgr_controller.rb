class ProjectMgrController < ApplicationController
  # Check that the user has the right authorization to access clients.
  before_action :verify_user_in_role!, except: [:get_project_tasks]
  before_action :init_dropdown_defaults

  init_dropdown_defaults_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def init_dropdown_defaults
    @project_title = params[:project_title] ||= ''
    @task_name = params[:task_name] ||= 'all'
    @wsd = params[:week_start_date] ||= ''
  end


  index_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def index
    @summaries = nil
    @task_names = WeeklyStatusDetail.distinct_task_names
  end

  summaries_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def summaries
    @task_names = WeeklyStatusDetail.distinct_task_names
    @summaries = WeeklySummary.retrieve_pm_summaries(project_title: @project_title, task_name: @task_name.split('|').last, week_start_date: @wsd)
    render project_mgr_index_path
  end
end
