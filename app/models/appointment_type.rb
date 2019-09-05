class AppointmentType < ApplicationRecord
  validates :type_of_appointment, presence: true

  has_many :doctors
end
