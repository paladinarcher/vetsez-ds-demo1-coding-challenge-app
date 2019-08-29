class CreateCardModels < ActiveRecord::Migration[5.2]
  def change
    create_table :card_models do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :branch
      t.datetime :appointment_date
      t.string :selection
      t.text :comment

      t.timestamps
    end
  end
end
