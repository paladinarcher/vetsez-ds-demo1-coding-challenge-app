Rails.application.routes.draw do
  devise_for :users
  post 'fetch_time' => 'react_component#fetch_time'

  %w(account rec_engine awaiting_approval).each { |path|
    get "/#{path}" => 'react_component#auth'
  }

=begin
  %w(login signup).each { |path|
    get "/#{path}" => 'react_component#no_auth'
  }
=end

  root :to => 'layouts#root'

end
