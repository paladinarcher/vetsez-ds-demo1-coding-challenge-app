Rails.application.routes.draw do
  class OnlyAjaxRequest
    def matches?(request)
      request.xhr? || Rails.env.development?
    end
  end

  # resources :comments

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'fetch_time' => 'comments#fetch_time', :constraints => OnlyAjaxRequest.new
  get 'list_comments' => 'comments#list_comments', :constraints => OnlyAjaxRequest.new
  post 'add_comment' => 'comments#add_comment', :constraints => OnlyAjaxRequest.new

  root :to => 'comments#root'

end
