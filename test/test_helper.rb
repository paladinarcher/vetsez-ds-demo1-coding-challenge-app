require 'simplecov'
SimpleCov.start 'rails'
require_relative '../config/environment'
require 'rails/test_help'
puts "inside test helper rb"
class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  # Not using fixtures
  # fixtures :all
  # puts "test"

  # Add more helper methods to be used by all tests here...
end
