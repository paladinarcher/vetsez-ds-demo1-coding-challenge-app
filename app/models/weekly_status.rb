require 'date'
require 'csv'

class WeeklyStatus < ApplicationRecord
  before_save :create_details
  belongs_to :user
  has_one_attached :weekly_csv
  has_many :weekly_status_details, dependent: :destroy
  attr_accessor :local_details
  def create_details
    @local_details = []
    csv =  CSV.parse(self.weekly_csv.download,headers:true)
    csv.by_row.each do |row|
      wsd = WeeklyStatusDetail.new
      wsd.send(:project_organization=,row["ProjectOrganization"])
      wsd.send(:project_code=,row["ProjectCode"])
      wsd.send(:project_title=,row["ProjectTitle"])
      wsd.send(:task_number=,row["TaskNumber"])
      wsd.send(:task=,row["Task"].to_i)
      wsd.send(:project_type=,row["ProjectType"])
      wsd.send(:person=,row["Person"])
      parsed_date = Date.strptime(row["Date"], '%m/%d/%Y')
      wsd.send(:task_date=,parsed_date)
      wsd.send(:comments=,row["Comments"])
      wsd.send(:hours=,row["Hours"].to_f)
      wsd.weekly_status = self
      @local_details << wsd
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