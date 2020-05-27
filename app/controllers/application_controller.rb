class ApplicationController < ActionController::Base
  include RouteHelper
  include Roles
  extend Roles::Annotate

  before_action :setup_gon
  rescue_from Exception, java.lang.Throwable, :with => :internal_error
  # rescue_from User::NotAuthorized, with: :user_not_authorized cris

  def internal_error(exception)
    $log.error{LEX("An unhandled exception occurred!", exception)}
    case exception
    when Roles::NotInRole
      flash[:error] = "You don't have access to this section."
      redirect_to root_path
      return
    else
      raise exception
    end
  end

  def setup_gon
    gon.routes = setup_routes
    gon.packs = packed_assets
    gon.user = ""
    gon.js = {}
  end

  #ensures the current user is the user passed in.
  #Typically used to ensure the underlying model being displayed (or modified) is this user.
  def verify_authorized(email)
    raise Roles::NotInRole.new "You are not authorized to view these details!" unless current_user.email.eql?(email)
  end

  private

=begin
cris
  def user_not_authorized
    flash[:error] = "You don't have access to this section."
    redirect_back(fallback_location: root_path)
  end
=end

end
