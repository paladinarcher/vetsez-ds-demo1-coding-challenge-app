class UnanetCsvUpload < ApplicationRecord
  has_one_attached :csv_upload

  def get_csv
    CSV.parse(csv_upload.download, headers: true)
  end

end
