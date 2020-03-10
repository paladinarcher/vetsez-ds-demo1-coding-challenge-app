require 'test_helper'
puts "inside sessions controller test"
class SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    ActionController::Base.allow_forgery_protection = false
  end
  # set allow_forgery_protection to false in environments/test.rb
  test "should create session/user for non-existent user" do
    assert_difference('User.count', 1) do
      post sessions_url, params: {user: {first_name: 'abcd', last_name: 'xy', email: 'ab@xy.com', password: 'password'}}
    end
    
    assert_equal(session[:user_id], User.last.id, "Session does not contain :user_id key")
    assert_redirected_to(user_path(User.last), "Not redirected to user page for user id: #{User.last.id}")
  end

  test "should create session for existing user" do
    user = User.find_by_first_name("foo")
    assert_no_difference('User.count', "There should not be a difference in User count for an existing user") do
      post sessions_url, params: {user: {first_name: 'foo', last_name: 'bar', email: 'foo@bar.com', password: 'password1'}}
    end
    
    assert_equal(session[:user_id], user.id, "Session does not contain :user_id key")
    assert_redirected_to(user_path(user.id), "Not redirected to user page for user id: #{user.id}")
  end
=begin
  test "should destroy session" do
    assert_difference('Session.count', -1) do
      delete session_url(@session)
    end

    assert_redirected_to sessions_url
  end
=end
end
