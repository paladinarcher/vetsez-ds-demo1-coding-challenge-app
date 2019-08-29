class CardModel < ApplicationRecord
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates_presence_of :first_name
  validates_presence_of :last_name
  validates_presence_of :selection
end
