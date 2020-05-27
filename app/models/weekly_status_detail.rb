class WeeklyStatusDetail < ApplicationRecord
  belongs_to :weekly_status

  scope :distinct_project_titles, -> {select(:timesheet_cell_project_title).distinct.order(:timesheet_cell_project_title)}
  scope :distinct_task_names, -> {select(:timesheet_cell_project_title, :timesheet_cell_task_name).distinct.order(:timesheet_cell_project_title, :timesheet_cell_task_name)}
end

# WeeklyStatusDetail.distinct_project_titles
# a.to_a.inject({}) {|h, e| h[:timesheet_cell_project_title] = e[:timesheet_cell_project_title]; h}
# a.to_a.map {|e| e[:timesheet_cell_project_title]}
#  WeeklyStatusDetail.distinct_task_names