class CreateDoctors < ActiveRecord::Migration[5.2]
  def change
    create_table :doctors do |t|
      t.string :name
      t.belongs_to :appointment_type
      t.belongs_to :facility

      t.timestamps
    end
  end
end
