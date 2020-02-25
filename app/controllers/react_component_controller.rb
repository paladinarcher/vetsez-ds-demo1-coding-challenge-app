class ReactComponentController < ApplicationController
  before_action :authenticate_user!, except: [:no_auth, :fetch_time]

  def auth
  end

  def no_auth
  end

  def fetch_time
    render json: {current_time: Time.now}
  end

end
