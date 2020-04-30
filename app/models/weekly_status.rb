require 'date'

class WeeklyStatus < ApplicationRecord
  before_save :create_details
  belongs_to :user
  has_one_attached :weekly_csv
  has_many :weekly_status_details, dependent: :destroy

  def create_details
    csv = self.weekly_csv.download.split
    headers = csv.shift
    headers_map = {}
    headers.split(',').each_with_index do |key, index|
      headers_map[key] = index
    end

    csv.each do |row|
      wsd = WeeklyStatusDetail.new
      wsd.send(:project_organization=,row[headers_map["ProjectOrganization"]])
      wsd.send(:project_code=,row[headers_map["ProjectCode"]])
      wsd.send(:project_title=,row[headers_map["ProjectTitle"]])
      wsd.send(:task_number=,row[headers_map["TaskNumber"]])
      wsd.send(:task=,row[headers_map["task"]].to_i)
      wsd.send(:project_type=,row[headers_map["ProjectType"]])
      wsd.send(:person=,row[headers_map["Person"]])
      parsed_date = Date.strptime(row[headers_map["Date"]], '%m/%d/%Y')
      wsd.send(:task_date=,parsed_date)
      wsd.send(:comments=,row[headers_map["Comments"]])
      wsd.send(:hours=,row[headers_map["Hours"].to_f])
      wsd.weekly_status = self
      # wsd.save!
      # self.weekly_status_details << wsd
    end
  end
end

=begin
w = WeeklyStatus.all.last
 a = w.weekly_csv
 a.download
a.content_type
 a.download.split.first
=end