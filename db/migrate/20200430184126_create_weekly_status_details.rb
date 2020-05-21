class CreateWeeklyStatusDetails < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_status_details do |t|
      t.references :weekly_status
      t.string :person_last_name
      t.string :person_first_name
      t.string :person_email_id
      t.string :person_timesheet_approval_group_name
      t.string :person_default_pay_code
      t.string :timesheet_cell_project_code
      t.string :timesheet_cell_task_name
      t.string :timesheet_cell_project_title
      t.date :timesheet_cell_work_date
      t.float :timesheet_cell_hours
      t.string :timesheet_cell_comments
      t.timestamps
    end
  end
end
