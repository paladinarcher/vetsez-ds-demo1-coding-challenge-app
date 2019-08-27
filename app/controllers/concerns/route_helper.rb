module RouteHelper
  include Webpacker::Helper
  include ActionView::Helpers::AssetUrlHelper

  IMAGE_EXTENSIONS = %w(.jpeg .jpg .png .gif).freeze

  if $WINDOWS
    IMAGE_ROOT_PATH = 'media/images/'
  else
    # For Linux/Unix
    IMAGE_ROOT_PATH = 'media/packs/images/'
  end

  def setup_routes
    original_verbosity = $VERBOSE
    $VERBOSE = nil
    routes = Rails.application.routes.named_routes.helper_names - ['rails_blob_path', 'rails_blob_url', 'rails_representation_path', 'rails_representation_url']
    $VERBOSE = original_verbosity
    @@routes_hash ||= {}
    if @@routes_hash.empty?
      routes.each do |route|
        begin
          @@routes_hash[route] = self.send(route)
        rescue ActionController::UrlGenerationError => ex
          if (ex.message =~ /missing required keys: \[(.*?)\]/)
            keys = $1
            keys = keys.split(',')
            keys.map! do |e|
              e.gsub!(':', '')
              e.strip
            end
            required_keys_hash = {}
            keys.each do |key|
              required_keys_hash[key.to_sym] = ':' + key.to_s
            end
            @@routes_hash[route] = self.send(route, required_keys_hash)
          else
            raise ex
          end
        end
      end
    end
    #$log.debug('routes hash passed to javascript is ' + @@routes_hash.to_s)
    @@routes_hash
  end

  def setup_packed_assets
    if Webpacker.instance.config.cache_manifest?
      @@packed_assets ||= packed_assets
    else
      @@packed_assets = packed_assets
    end
  end

  private

  def packed_assets
    h = {}
    h[:paths] = {}
    h[:urls] = {}
    h[:urls][:images] = {}
    h[:paths][:images] = {}
    Webpacker.instance.manifest.refresh.each_pair do |k,v|
      unless k =~ /map$|entrypoints$/
        url = asset_pack_url k
        path = asset_pack_path k
        h[:urls][k] = url
        h[:paths][k] = path
        if IMAGE_EXTENSIONS.include?(File.extname k)
          rootless = k.sub(IMAGE_ROOT_PATH,'')
          h[:urls][:images][k] = url
          h[:urls][:images][rootless] = url
          h[:paths][:images][k] = path
          h[:paths][:images][rootless] = path
        end
      end
    end
    h
  end

end
=begin
Webpacker.instance.manifest
Webpacker.instance.manifest.refresh #gives hash
include Webpacker::Helper
include ActionView::Helpers::AssetUrlHelper
include ActionView::Helpers::AssetTagHelper
Webpacker.instance.config.cache_manifest?

=end