require 'test_helper'

class ReactComponentControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "should login approved user" do
    user = User.find_by_email('approved@va.com')
    sign_in user
    get account_url

    assert_response :success
  end

  test "should not login unapproved user" do
    user = User.find_by_email('unapproved@va.com')
    sign_in user
    get account_url

    assert_redirected_to(awaiting_approval_path)
  end
end
