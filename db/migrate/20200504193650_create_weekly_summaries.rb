class CreateWeeklySummaries < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_summaries do |t|
      t.references :weekly_status, index: true
      t.string :project_organization
      t.string :project_code
      t.string :project_title
      t.string :task_number
      t.string :task
      t.string :project_type
      t.string :person
      t.float :total_hours
      t.string :weekly_summary_comment
      t.string :blockers
      t.string :next_planned_activity
      t.timestamps
    end
  end
end