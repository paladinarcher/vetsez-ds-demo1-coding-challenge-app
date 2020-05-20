class CreateWeeklyStatuses < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_statuses do |t|
      t.string :user_email
      t.date :week_start_date
      t.timestamps
    end

    add_index :weekly_statuses, [:user_email, :week_start_date], :unique => true, :name=>'idx_weekly_statuses'
  end
end
