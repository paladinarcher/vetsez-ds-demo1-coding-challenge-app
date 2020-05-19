class CreateWeeklyStatusDetails < ActiveRecord::Migration[5.2]
  include Unanet::Reports::Columns
  def change
    create_table :weekly_status_details do |t|
      t.string :person_code
      t.string :person_last_name
      t.string :person_first_name
      t.string :person_email_id
      t.string :person_active
      t.string :person_default_pay_code
      t.string :person_time_entry_increment
      t.string :person_time_entry_increment
      t.string :person_time_period_type
      t.string :person_time_period_name
      t.string :timesheet_cell_project_code
      t.string :timesheet_cell_task_name

# https://vetsez.unanet.biz/vetsez/action/reports/adhoc/report?runFrom=A_79
#
      # TIMESHEET_CELL_PROJECT_TITLE = 'TIMESHEET CELL PROJECT TITLE'
      # TIMESHEET_TIME_PERIOD_BEGIN_DATE = 'TIMESHEET TIME PERIOD BEGIN DATE'
      # TIMESHEET_TIME_PERIOD_END_DATE = 'TIMESHEET TIME PERIOD END DATE'
      # TIMESHEET_CELL_WORK_DATE = 'TIMESHEET CELL WORK DATE'
      # TIMESHEET_STATUS = 'TIMESHEET STATUS'
      # TIMESHEET_STATUS_DATE = 'TIMESHEET STATUS DATE'
      # TIMESHEET_CELL_HOURS = 'TIMESHEET CELL HOURS'
      # TIMESHEET_CELL_CLASSIFICATION = 'TIMESHEET CELL CLASSIFICATION'
      # TIMESHEET_CELL_LABOR_CATEGORY_NAME = 'TIMESHEET CELL LABOR CATEGORY NAME'
      # TIMESHEET_CELL_COMMENTS = 'TIMESHEET CELL COMMENTS'
      #
      # t.string
      # t.integer :task_number
      # t.string :task
      # t.string :project_type
      # t.string :person
      # t.string :email
      # t.date :task_date
      # t.string :comments
      # t.float :hours
      # t.references :weekly_status
      # t.timestamps
    end
  end
end
