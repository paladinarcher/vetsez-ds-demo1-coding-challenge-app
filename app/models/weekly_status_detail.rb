class WeeklyStatusDetail < ApplicationRecord
  belongs_to :weekly_status

  def weekly_status_details
    WeeklyStatusDetail.find_by_weekly_status_id(WeeklyStatus.latest_start_of_week('04/30/2020', current_user.id) )
  end
end
