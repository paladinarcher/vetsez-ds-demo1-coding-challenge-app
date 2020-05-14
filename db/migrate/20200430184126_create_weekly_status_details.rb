class CreateWeeklyStatusDetails < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_status_details do |t|
      t.string :project_code
      t.string :project_title
      t.integer :task_number
      t.string :task
      t.string :project_type
      t.string :person
      t.string :email
      t.date :task_date
      t.string :comments
      t.float :hours
      t.references :weekly_status
      t.timestamps
    end
  end
end
