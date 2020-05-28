module ProjectMgrHelper
  # used with options_for_select to load the weekly_start_dates drop down
  def week_start_date_options
    ProjectHelper.distinct_weekly_start_dates.inject([]) do |ret, wsd|
      ret << ["#{wsd['week_start_date'].strftime("%m/%d/%Y")} through #{(wsd['week_start_date'] + 6).strftime("%m/%d/%Y")}", wsd['week_start_date']]; ret
    end
  end

  def convert_distinct_tasks
    titles = {}
    #WeeklyStatusDetail.distinct_task_names.each do |e|
    ProjectHelper.distinct_task_names.each do |e|
      titles[e.timesheet_cell_project_title] ||= []
      titles[e.timesheet_cell_project_title] << e.timesheet_cell_task_name
    end
    titles
  end
end
