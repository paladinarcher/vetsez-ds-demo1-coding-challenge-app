class Doctor < ApplicationRecord
  belongs_to :facility
  belongs_to :appointment_type

  def get_appt_type
    appointment_type
  end

  def get_facility
    facility
  end

end
