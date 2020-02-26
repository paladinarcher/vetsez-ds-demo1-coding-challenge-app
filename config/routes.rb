Rails.application.routes.draw do
  devise_for :users
  post 'fetch_time' => 'react_component#fetch_time'

  # root :to => 'welcome#index'

  %w(welcome rec_engine).each { |path|
    get "/#{path}" => 'react_component#auth'
  }

  %w(login signup).each { |path|
    get "/#{path}" => 'react_component#no_auth'
  }

  root :to => 'layouts#root'

end
