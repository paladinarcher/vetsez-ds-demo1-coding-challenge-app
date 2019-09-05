class Facility < ApplicationRecord
  validates :location, presence: true
end
