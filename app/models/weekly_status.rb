require 'date'
require 'csv'

class WeeklyStatus < ApplicationRecord
  before_save :create_details
  after_save :inactivate_previous
  belongs_to :user
  has_one_attached :weekly_csv
  has_many :weekly_status_details, dependent: :destroy
  has_many :weekly_summaries, dependent: :destroy
  attr_accessor :local_details
  accepts_nested_attributes_for :weekly_summaries, allow_destroy: true


  def self.latest_start_of_week(start_of_week, user)
    WeeklyStatus.where("week_start_date = ? and user_id = ? and active = true", WeeklyStatus.get_start_of_week(start_of_week), user.id)
  end

  # sr = WeeklyStatus.build_summary_row(f)
  def WeeklyStatus.build_summary_row(row)
    summary_row = row.as_json
    summary_row.tap {|hs| hs.delete('id') && hs.delete('task_date') && hs.delete('hours') && hs.delete('comments') && hs.delete('created_at') && hs.delete('updated_at')}
    summary_row['weekly_summary_comment'] = "#{row.task_date.to_s}: #{row.comments}\n"
    summary_row['total_hours'] = row.hours
    summary_row
  end

  # dets = WeeklyStatus.gb
  def WeeklyStatus.weekly_summary(weekly_status_id)
    # ws = WeeklyStatus.latest_start_of_week('04/30/2020', 4)
    sql = "select * from weekly_status_details where weekly_status_details.weekly_status_id = #{weekly_status_id} order by project_code, task_number, task_date"
    details = WeeklyStatusDetail.find_by_sql(sql)
    summary = []
    summary_row = {}

    if details.count > 0
      details.each do |row|
        pc = row.project_code
        tn = row.task_number
        hr = row.hours
        daily_comment = "#{row.task_date.to_s}: #{row.comments}\n"

        if summary_row.empty?
          summary_row = build_summary_row(row)
        else
          # sum the hours and append comments if the project_code and task number is the same as the summary row
          if summary_row['project_code'].eql?(pc) && summary_row['task_number'].eql?(tn)
            summary_row['total_hours'] = summary_row['total_hours'] + hr
            summary_row['weekly_summary_comment'] << daily_comment
          # add the summary_row to the array and build a new summary_row and continue looping
          else
            summary << summary_row
            summary_row = build_summary_row(row)
          end
        end
      end
    else
    #  no details?!
    end
    summary
  end

=begin
  #    result = WeeklyStatus.greg(user_id: 4, week_start_date: '04/26/2020')
  #    load './app/models/weekly_status.rb'
  def self.query_example(user_id:, week_start_date:)
    sql = %Q{
      select * from (
        select week_start_date, project_organization, project_code, project_title, task_number, task, person, sum(hours) as hr, '' as summary_comment
        from  (
          select TO_CHAR(a.week_start_date, 'YYYY-MM-DD') as week_start_date, b.*
          from weekly_statuses a, weekly_status_details b
          where a.id = b.weekly_status_id
          and   a.user_id = ?
          and   a.active = true
          and   a.week_start_date = ?
        ) as sum_hours
        group by week_start_date, project_organization, project_code, project_title, task_number, task, person
      union all
        select distinct week_start_date as week_start_date, project_organization, project_code, project_title, task_number, task, person, 0 as hr, task_date || ': ' || coalesce(comments, null, '<empty comment>') as summary_comments
        from (
          select TO_CHAR(a.week_start_date, 'YYYY-MM-DD') as week_start_date, project_organization, project_code, project_title, task_number, task, person, task_date, comments
          from weekly_statuses a, weekly_status_details b
          where a.id = b.weekly_status_id
          and   a.user_id = ?
          and   a.active = true
          and   a.week_start_date = ?
          order by project_code, task_number, task_date
          ) as ordered_comments
        ) as summary_data
        order by project_code, task_number, hr
      }

    wsd = Date.strptime(week_start_date, '%m/%d/%Y')
    args = {user_id: 4, week_start_date: wsd, user_id2: 4, week_start_date2: wsd }
    binds = WeeklyStatus.resolve_sql_bindings(args)
    result = ApplicationRecord.connection.exec_query(sql, 'user_weekly_summary', binds)
    result.to_hash
  end
  def self.resolve_sql_bindings(**args)
    bindings = []
    idx = 0
    args.each_pair do |name, value|
      idx = idx + 1
      if value.is_a? Integer
        bindings << ActiveRecord::Relation::QueryAttribute.new(name.to_s, value, ActiveRecord::Type::Integer.new)
      elsif value.is_a? String
        bindings << ActiveRecord::Relation::QueryAttribute.new(name.to_s, value, ActiveRecord::Type::String.new)
      elsif value.is_a?(TrueClass) || value.is_a?(FalseClass)
        bindings << ActiveRecord::Relation::QueryAttribute.new(name.to_s, value, ActiveRecord::Type::Boolean.new)
      elsif value.is_a? Float
        bindings << ActiveRecord::Relation::QueryAttribute.new(name.to_s, value, ActiveRecord::Type::Float.new)
      elsif value.is_a? Date
        bindings << ActiveRecord::Relation::QueryAttribute.new(name.to_s, value, ActiveRecord::Type::Date.new)
      elsif value.is_a? DateTime
        bindings << ActiveRecord::Relation::QueryAttribute.new(name.to_s, value, ActiveRecord::Type::DateTime.new)
      elsif value.is_a? Time
        bindings << ActiveRecord::Relation::QueryAttribute.new(name.to_s, value, ActiveRecord::Type::Time.new)
      else
        raise 'error - not supported'
      end
    end
    bindings
  end
=end

  # summary_rows = WeeklyStatus.calc_summary(result)
  def WeeklyStatus.calc_summary(result)
    summary = nil

    if result.count > 0
      summary_row = {}

      result.each do |row|
        if summary.nil?
          summary = []
          summary_row = row.clone
        else
          # the project and task are the same as the summary row so sum the hours and combine the summary comments
          if row['project_code'].eql?(summary_row['project_code']) && row['task_number'].eql?(summary_row['task_number'])
            summary_row['hr'] = summary_row['hr'] + row['hr']
            summary_row['summary_comment'] = summary_row['summary_comment'] << "\n" << row['summary_comment']
            # this is a break so push the summary row on to the summary stack and clone this new record
          else
            summary << summary_row
            summary_row = row.clone
          end
        end
      end
    else
      puts 'results not found!'
    end
    summary
  end

    def inactivate_previous
    WeeklyStatus.where("week_start_date = ? and user_id = ? and id != ?",
                       self.week_start_date,
                       self.user_id,
                       self.id).update_all({active: false})
  end

  def create_details
    @local_details = []

    if self.new_record?
      csv =  CSV.parse(self.weekly_csv.download,headers:true)
      earliest_date = 10.years.from_now.to_date

      csv.by_row.each do |row|
        wsd = WeeklyStatusDetail.new
        wsd.send(:project_code=,row["ProjectCode"].to_s.strip)
        wsd.send(:project_title=,row["ProjectTitle"].to_s.strip)
        wsd.send(:task_number=,row["TaskNumber"].to_i)
        wsd.send(:task=,row["Task"].to_s.strip)
        wsd.send(:project_type=,row["ProjectType"].to_s.strip)
        wsd.send(:person=,row["Person"].to_s.strip)
        wsd.send(:email=,row["Email"].to_s.strip)
        parsed_date = Date.strptime(row["Date"].to_s.strip, '%m/%d/%Y')
        wsd.send(:task_date=,parsed_date)
        wsd.send(:comments=,row["Comments"].to_s.strip)
        wsd.send(:hours=,row["Hours"].to_f)
        wsd.weekly_status = self
        @local_details << wsd

        if parsed_date < earliest_date
          earliest_date = parsed_date
        end
      end

      self.week_start_date = WeeklyStatus.get_start_of_week(earliest_date)
    end
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
 latest = WeeklyStatus.latest_start_of_week(Date.strptime('4/30/2 020', '%m/%d/%Y'), User.find(3))

=end