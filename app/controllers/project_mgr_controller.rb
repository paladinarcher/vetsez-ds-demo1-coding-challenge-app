class ProjectMgrController < ApplicationController
  # Check that the user has the right authorization to access clients.
  before_action :verify_user_in_role!

  index_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def index
    @summaries = nil
    @project_titles = WeeklyStatusDetail.distinct_project_titles
    @task_names = WeeklyStatusDetail.distinct_task_names
    week_start_dates = WeeklyStatus.distinct_start_of_week(:desc)
    @wsd_options = week_start_dates.inject([]) do |ret,wsd|
      ret << ["#{wsd['week_start_date']} to #{wsd['week_start_date'] + 6}", wsd['week_start_date']]; ret
    end

    @selected_task_name = 'all'
  end

  summaries_roles(RoleTags::PM_ROLE, RoleTags::SENIOR_PM_ROLE)
  def summaries
    @project_titles = WeeklyStatusDetail.distinct_project_titles
    @task_names = WeeklyStatusDetail.distinct_task_names
    week_start_dates = WeeklyStatus.distinct_start_of_week(:desc)
    @wsd_options = week_start_dates.inject([]) do |ret,wsd|
      ret << ["#{wsd['week_start_date']} to #{wsd['week_start_date'] + 6}", wsd['week_start_date']]; ret
    end

    @project_title = params[:project_title]
    @task_name = params[:task_name]
    @wsd = params[:week_start_date]
    @summaries = WeeklySummary.retrieve_pm_summaries(project_title: @project_title, task_name: @task_name.split('|').last, week_start_date: @wsd)
    render project_mgr_index_path
  end
end
