class ReactComponentController < ApplicationController
  before_action :authenticate_user!, except: :no_auth

  def auth
  end

  def no_auth
  end
end
