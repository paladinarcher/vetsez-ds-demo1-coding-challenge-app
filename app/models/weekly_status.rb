require 'date'
require 'csv'

class WeeklyStatus < ApplicationRecord
  before_save :create_details
  belongs_to :user
  has_one_attached :weekly_csv
  has_many :weekly_status_details, dependent: :destroy
  attr_accessor :local_details

  def self.latest_start_of_week(start_of_week, user)
    WeeklyStatus.where("week_start_date = ? and user_id = ?", WeeklyStatus.get_start_of_week(start_of_week), user.id).last
  end

  def create_details
    @local_details = []
    csv =  CSV.parse(self.weekly_csv.download,headers:true)
    earliest_date = 10.years.from_now

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

      if parsed_date < earliest_date
        earliest_date = parsed_date
      end
    end

    self.week_start_date = WeeklyStatus.get_start_of_week(earliest_date)
  end

  def self.get_start_of_week(date)
    dow = date.cwday
    ret = date

    if dow > 0
      ret = (date - dow)
    end
    ret
  end
end


=begin
load './app/models/weekly_status.rb'
w = WeeklyStatus.all.last
 a = w.weekly_csv
 a.download
a.content_type
 a.download.split.first

# to get the latest summary upload (in case they uploaded multiple times for a given week)
 latest = WeeklyStatus.latest_start_of_week(Date.strptime('4/30/2020', '%m/%d/%Y'), User.find(3))

=end