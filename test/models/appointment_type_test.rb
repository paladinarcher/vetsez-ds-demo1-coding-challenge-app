require 'test_helper'

class AppointmentTypeTest < ActiveSupport::TestCase
    test "Appointment Type cannot be created without type attribute" do
      appt = AppointmentType.new
      assert_not appt.save
   end
end
