require 'date'
require 'csv'
require './lib/unanet/UnanetReports'

class WeeklyStatus < ApplicationRecord
  include Unanet::Reports::Columns

  before_save :create_details
  has_one_attached :weekly_csv
  has_many :weekly_status_details, dependent: :destroy
  has_many :weekly_summaries, dependent: :destroy
  attr_accessor :local_details
  attr_accessor :csv_magic
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

  def create_details
    @local_details = []

    if self.new_record?
      if @csv_magic
        csv = @csv_magic
        csv =  CSV.parse(self.weekly_csv.download,headers:true)
      end

      earliest_date = 10.years.from_now.to_date

      csv.by_row.each do |row|
        keep_going = row[PERSON_CODE] rescue false
        next unless keep_going

        wsd = WeeklyStatusDetail.new
        wsd.send(:person_code=,row[PERSON_CODE].to_s.strip)
        wsd.send(:person_last_name=,row[PERSON_LAST_NAME].to_s.strip)
        wsd.send(:person_first_name=,row[PERSON_FIRST_NAME].to_s.strip)
        wsd.send(:person_email_id=,row[PERSON_EMAIL_ID].to_s.strip)
        wsd.send(:person_active=,row[PERSON_ACTIVE].to_s.strip)
        wsd.send(:person_default_pay_code=,row[PERSON_DEFAULT_PAY_CODE].to_s.strip)
        wsd.send(:person_time_entry_increment=,row[PERSON_TIME_ENTRY_INCREMENT].to_s.strip)
        wsd.send(:person_time_period_type=,row[PERSON_TIME_PERIOD_TYPE].to_s.strip)
        wsd.send(:person_time_period_name=,row[PERSON_TIME_PERIOD_NAME].to_s.strip)
        wsd.send(:timesheet_cell_project_code=,row[TIMESHEET_CELL_PROJECT_CODE].to_s.strip) #key uniq
        wsd.send(:timesheet_cell_task_name=,row[TIMESHEET_CELL_TASK_NAME].to_s.strip) #key uniq
        wsd.send(:timesheet_cell_project_title=,row[TIMESHEET_CELL_PROJECT_TITLE].to_s.strip) #key uniq

        parsed_date = Date.strptime(row[TIMESHEET_TIME_PERIOD_BEGIN_DATE].to_s.strip, '%m/%d/%Y')
        wsd.send(:timesheet_time_period_begin_date=,parsed_date)

        parsed_date = Date.strptime(row[TIMESHEET_TIME_PERIOD_END_DATE].to_s.strip, '%m/%d/%Y')
        wsd.send(:timesheet_time_period_end_date=,parsed_date)

        work_date = Date.strptime(row[TIMESHEET_CELL_WORK_DATE].to_s.strip, '%m/%d/%Y')
        wsd.send(:timesheet_cell_work_date=,work_date)

        wsd.send(:timesheet_status=,row[TIMESHEET_STATUS].to_s.strip)

        # parsed_date = Date.strptime(row[TIMESHEET_STATUS_DATE].to_s.strip, '%m/%d/%Y')
        # wsd.send(:timesheet_status_date=,parsed_date)

        wsd.send(:timesheet_cell_hours=,row[TIMESHEET_CELL_HOURS].to_f)
        wsd.send(:timesheet_cell_classification=,row[TIMESHEET_CELL_CLASSIFICATION].to_s.strip)
        wsd.send(:timesheet_cell_labor_category_name=,row[TIMESHEET_CELL_LABOR_CATEGORY_NAME].to_s.strip)
        wsd.send(:timesheet_cell_comments=,row[TIMESHEET_CELL_COMMENTS].to_s.strip)

        wsd.weekly_status = self
        @local_details << wsd

        if work_date < earliest_date
          earliest_date = work_date
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