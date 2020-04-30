class WeeklyStatus < ApplicationRecord
  belongs_to :user
  has_one_attached :weekly_csv
end
