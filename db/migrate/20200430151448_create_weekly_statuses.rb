class CreateWeeklyStatuses < ActiveRecord::Migration[5.2]
  def change
    create_table :weekly_statuses do |t|
      t.references :user, index: true
      t.timestamps
    end
  end
end
