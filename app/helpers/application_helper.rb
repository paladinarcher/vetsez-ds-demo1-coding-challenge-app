module ApplicationHelper
  # helper method used with the asset_pack_path for resolving image paths
  # for example:  <img style="vertical-align: middle" src="<%= asset_pack_path image('va-logo-white.png') %>"  alt="VA Header Image"/>
  def image(img)
    RouteHelper::IMAGE_ROOT_PATH + img
  end

  def span_label(label)
    span = label.is_a?(Symbol) ? label.to_s.split('_').map(&:capitalize).join(' ') : label
    "<span class='span_label'>#{span}:</span><br>".html_safe
  end
end
