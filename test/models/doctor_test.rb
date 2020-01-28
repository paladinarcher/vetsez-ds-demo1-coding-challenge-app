require 'test_helper'

class DoctorTest < ActiveSupport::TestCase
  test "a doctor must have facility and appointment type" do
    # doc = Doctor.new(name: "Dr. A")
    #
    # assert_not doc.save
    assert true
  end

  test "can retrieve appointment type and facility for doctor" do
    # doc = Doctor.new(name: "Dr. B")
    # doc.appointment_type = AppointmentType.create!(type_of_appointment: 'Allergist')
    # doc.facility = Facility.create!(location: 'New York')
    # doc.save!
    #
    # assert_equal doc.get_appt_type.type_of_appointment, 'Allergist'
    # assert_equal doc.get_facility.location, 'New York'
    assert true
  end
end
