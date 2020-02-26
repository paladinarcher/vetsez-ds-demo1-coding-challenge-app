Rails.application.routes.draw do
  devise_for :users
  post 'fetch_time' => 'react_component#fetch_time'

  %w(account rec_engine).each { |path|
    get "/#{path}" => 'react_component#auth'
  }


  %w(awaiting_approval).each { |path|
    get "/#{path}" => 'react_component#awaiting_approval'
  }


  root :to => 'layouts#root'

end
