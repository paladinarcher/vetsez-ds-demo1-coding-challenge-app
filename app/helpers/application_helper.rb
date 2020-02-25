module ApplicationHelper
  # helper method used with the asset_pack_path for resolving image paths
  # for example:  <img style="vertical-align: middle" src="<%= asset_pack_path image('va-logo-white.png') %>"  alt="VA Header Image"/>
  def image(img)
    RouteHelper::IMAGE_ROOT_PATH + img
  end
end
