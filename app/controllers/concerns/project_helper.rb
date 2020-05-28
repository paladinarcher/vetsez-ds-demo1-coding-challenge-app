module ProjectHelper
  extend ActiveSupport::Concern

  class << self
    attr_accessor :distinct_project_titles
    attr_accessor :distinct_weekly_start_dates
  end

  ProjectHelper.distinct_project_titles ||= WeeklyStatusDetail.distinct_project_titles
  ProjectHelper.distinct_weekly_start_dates ||= WeeklyStatus.distinct_start_of_week(:desc)
end
