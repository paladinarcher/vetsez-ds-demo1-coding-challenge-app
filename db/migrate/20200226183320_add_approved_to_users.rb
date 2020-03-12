class AddApprovedToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :approved, :boolean, default: false
    add_index :users, :approved
  end
end
