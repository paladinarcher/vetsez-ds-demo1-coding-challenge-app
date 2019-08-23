Rails.application.routes.draw do
  # resources :comments

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'fetch_time' => 'comments#fetch_time'
  get 'list_comments' => 'comments#list_comments'
  post 'add_comment' => 'comments#add_comment'

  root :to => 'comments#root'

end
