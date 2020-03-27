Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  post 'fetch_time' => 'react#fetch_time'

  %w(mock1 mock2 mock3 mock4).each { |path|
    get "/#{path}" => 'react#auth'
  }


  %w(rec_engine).each { |path|
    get "/#{path}" => 'react#no_auth'
  }

  root :to => 'layouts#root'

end
