class CreateUnanetCsvUpload < ActiveRecord::Migration[5.2]
  def change
    create_table :unanet_csv_uploads do |t|
      t.string :user_email
      t.timestamps
    end
  end
end
