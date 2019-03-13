class ApplicationController < ActionController::Base
  include RouteHelper
  before_action :setup_gon

  def setup_gon
    gon.routes = setup_routes
    gon.packs = packed_assets
  end
end
