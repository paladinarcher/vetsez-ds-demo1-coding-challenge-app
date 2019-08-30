require 'test_helper'

class ScheduleControllerTest < ActionDispatch::IntegrationTest
  test "should get get_facilities" do
    get schedule_get_facilities_url
    assert_response :success
  end

  test "should get get_appointment_types" do
    get schedule_get_appointment_types_url
    assert_response :success
  end

  test "should get get_user" do
    get schedule_get_user_url
    assert_response :success
  end

end
