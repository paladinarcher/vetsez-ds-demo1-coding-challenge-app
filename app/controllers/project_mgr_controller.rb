class ProjectMgrController < ApplicationController
  # Check that the user has the right authorization to access clients.
  before_action :verify_user_in_role!, except: [:get_project_tasks]
  before_action :init_dropdown_defaults

  init_dropdown_defaults_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def init_dropdown_defaults
    @project_title = params[:project_title] ||= ''
    @task_name = params[:task_name] ||= 'all'
    @wsd = params[:week_start_date] ||= ''
    @task_options = helpers.convert_distinct_tasks[@project_title].to_a
  end


  index_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def index
    @summaries = nil
  end

  summaries_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def summaries
    @summaries = WeeklySummary.retrieve_pm_summaries(project_title: @project_title, task_name: @task_name, week_start_date: @wsd)
    render project_mgr_index_path
  end
end
