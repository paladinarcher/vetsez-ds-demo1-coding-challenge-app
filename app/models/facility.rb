class Facility < ApplicationRecord
  validates :location, presence: true

  has_many :doctors

  def get_doctors
    doctors
  end
end
