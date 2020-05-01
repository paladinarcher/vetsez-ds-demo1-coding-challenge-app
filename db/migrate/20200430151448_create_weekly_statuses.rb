class CreateWeeklyStatuses < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_statuses do |t|
      t.references :user, index: true
      t.date :week_start_date
      t.boolean :active, default: true
      t.timestamps
    end
  end
end
