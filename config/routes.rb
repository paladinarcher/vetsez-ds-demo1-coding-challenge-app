Rails.application.routes.draw do
  devise_for :users
  post 'fetch_time' => 'react_component#fetch_time'
  get 'get_facilities' => 'schedule#get_facilities'
  get 'get_appointment_types' => 'schedule#get_appointment_types'
  get 'get_doctors' => 'schedule#get_doctors'
  post 'form_inputs' => 'layouts#form_inputs'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

root :to => 'welcome#index'

%w(welcome rec_engine).each { |path|
  get "/#{path}" => 'react_component#auth'
}

%w(login signup).each { |path|
  get "/#{path}" => 'react_component#no_auth'
}
end
