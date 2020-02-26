ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  #fixtures :all
  puts "test"

  include Devise::Test::IntegrationHelpers
  include Warden::Test::Helpers

  # Add more helper methods to be used by all tests here...
end
