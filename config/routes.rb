Rails.application.routes.draw do
  # resources :card_models
  # resources :comments

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  get 'fetch_time' => 'comments#fetch_time'
  get 'list_comments' => 'comments#list_comments'
  post 'add_comment' => 'comments#add_comment'
  # post 'uncontrolled_form' => 'card_models#create'
  post 'post_form' => 'card_models#ajax_post_form'
  get 'get_selections' => 'card_models#get_selections'
  get 'get_table_data' => 'card_models#get_table_data'

  root :to => 'comments#root'

end
