class WeeklyStatus < ApplicationRecord
  belongs_to :user
  has_one_attached :weekly_csv
end
=begin
w = WeeklyStatus.all.last
 a = w.weekly_csv
 a.download
a.content_type
 a.download.split.first
=end