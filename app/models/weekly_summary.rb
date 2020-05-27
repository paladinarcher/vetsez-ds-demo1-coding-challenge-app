class WeeklySummary < ApplicationRecord
  belongs_to :weekly_status

  # project_title = "TO 7 - VLER VHIE Agile Development Services_Option Period 2"
  # task_name = "VHIE Agile Development Services_Option Period 2"
  # result = WeeklySummary.retrieve_pm_summaries(project_title: project_title, task_name: task_name)
  def self.retrieve_pm_summaries(project_title:, task_name:, week_start_date:)
    where_str = "timesheet_cell_project_title = ? and timesheet_cell_task_name #{! task_name.empty? && ! task_name.eql?('all') ? ' = ?' : ' != ?'}"
    WeeklySummary.where(where_str, project_title, task_name).joins(:weekly_status).merge( WeeklyStatus.where(week_start_date: week_start_date) )
  end
end
