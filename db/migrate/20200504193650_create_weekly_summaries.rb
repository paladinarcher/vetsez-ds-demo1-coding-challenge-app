class CreateWeeklySummaries < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_summaries do |t|
      t.references :weekly_status, index: true
      t.string :person_last_name
      t.string :person_first_name
      t.string :person_email_id
      t.string :person_timesheet_approval_group_name
      t.string :person_default_pay_code
      t.string :timesheet_cell_project_code
      t.string :timesheet_cell_task_name
      t.string :timesheet_cell_project_title
      t.float :total_hours
      t.string :weekly_summary_comment
      t.string :blockers
      t.string :next_planned_activity
      t.boolean :reviewed, default: false
      t.timestamps
    end
    add_index :weekly_summaries, [:timesheet_cell_project_title, :timesheet_cell_task_name], :name=>'idx_project_title_task_name'
  end
end