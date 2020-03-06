class ReactController < ApplicationController
  # react components requiring authenticated users hit this route
  def auth
  end

  # route for unauthenticated users for a react component
  def no_auth
  end

  # test axios call
  def fetch_time
    render json: {current_time: Time.now}
  end
end
