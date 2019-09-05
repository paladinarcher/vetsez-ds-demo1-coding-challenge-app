class AppointmentType < ApplicationRecord
  validates :type_of_appointment, presence: true
end
