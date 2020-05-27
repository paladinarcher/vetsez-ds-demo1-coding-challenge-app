class CreateWeeklyStatuses < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_statuses do |t|
      t.string :user_email
      t.date :week_start_date
      t.integer :summary_status, default: 0
      t.timestamps
    end
    add_index :weekly_statuses, [:week_start_date], :name=>'idx_week_start_date'
    add_index :weekly_statuses, [:user_email, :week_start_date], :unique => true, :name=>'idx_week_start_date_user_email'
  end
end
