module ProjectMgrHelper
  # used with options_for_select to load the weekly_start_dates drop down
  def week_start_date_options
    ProjectHelper.distinct_weekly_start_dates.inject([]) do |ret,wsd|
      ret << ["#{wsd['week_start_date'].strftime("%m/%d/%Y")} through #{(wsd['week_start_date'] + 6).strftime("%m/%d/%Y")}", wsd['week_start_date']]; ret
    end
  end
end
