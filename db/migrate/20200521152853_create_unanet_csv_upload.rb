class CreateUnanetCsvUpload < ActiveRecord::Migration[5.2]
  def change
    create_table :unanet_csv_uploads do |t|
      t.user_email :string
    end
  end
end
