require 'test_helper'

class ScheduleControllerTest < ActionDispatch::IntegrationTest
  test "should get get_facilities" do
    get get_facilities_url
    assert_response :success
  end

  test "should get get_appointment_types" do
    get get_appointment_types_url
    assert_response :success
  end

  # test "should get doctors will return array of doctors" do
  #   doc = Doctor.first
  #   appt_type_id = doc.get_appt_type.id
  #   facility_id = doc.get_facility.id
  #
  #   get get_doctors_url(facility_id: facility_id, appointment_type_id: appt_type_id)
  #
  #   assert_response :success
  #   assert_equal 200, response.status
  #
  #   doc_hash = JSON.parse(response.body).select {|resp| resp["name"] == doc.name }.first
  #
  #   assert_equal doc.id, doc_hash["id"]
  # end
end
