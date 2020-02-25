require 'test_helper'
require 'json'
class UsersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get users_url
    user_list = JSON.parse(@response.body)
    
    assert_predicate(user_list[0]["password"], :nil?)
    assert_equal(5, user_list.length)
  end
=begin
  test "should create new user" do
    assert_difference('User.count', 1) do
      post users_url, params: {user: {first_name: 'abcd', last_name: 'xy', email: 'ab@xy.com', password: 'password'}}
    end
  end
  test "should get show" do
    get user_show_url
    assert_response :success
  end

  test "should get destroy" do
    get user_destroy_url
    assert_response :success
  end
=end
end
