require 'test_helper'

class ReactComponentControllerControllerTest < ActionDispatch::IntegrationTest
  test "should get auth" do
    get react_component_controller_auth_url
    assert_response :success
  end

  test "should get no_auth" do
    get react_component_controller_no_auth_url
    assert_response :success
  end

end
