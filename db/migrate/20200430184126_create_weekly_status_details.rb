class CreateWeeklyStatusDetails < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_status_details do |t|
      t.string :person_code
      t.string :person_last_name
      t.string :person_first_name
      t.string :person_email_id
      t.string :person_active
      t.string :person_default_pay_code
      t.string :person_time_entry_increment
      t.string :person_time_period_type
      t.string :person_time_period_name
      t.string :timesheet_cell_project_code
      t.string :timesheet_cell_task_name
      t.string :timesheet_cell_project_title
      t.date :timesheet_time_period_begin_date
      t.date :timesheet_time_period_end_date
      t.date :timesheet_cell_work_date
      t.string :timesheet_status
      # t.date :timesheet_status_date
      t.float :timesheet_cell_hours
      t.string :timesheet_cell_classification
      t.string :timesheet_cell_labor_category_name
      t.string :timesheet_cell_comments
      t.references :weekly_status
    end
  end
end
