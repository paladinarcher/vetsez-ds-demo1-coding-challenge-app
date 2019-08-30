Rails.application.routes.draw do
  get 'schedule/get_facilities'
  get 'schedule/get_appointment_types'
  get 'schedule/get_user'
  # resources :comments

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'fetch_time' => 'comments#fetch_time'
  get 'list_comments' => 'comments#list_comments'
  post 'add_comment' => 'comments#add_comment'

  root :to => 'comments#root'

end
