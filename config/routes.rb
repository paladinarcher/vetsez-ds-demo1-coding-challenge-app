Rails.application.routes.draw do
  resources :recipes
  resources :weekly_status

  get 'admin_upload/index'
  post  "admin_upload" =>'admin_upload#upload'

  get 'project_mgr/index'
  get 'get_project_tasks' => 'project_mgr#get_project_tasks'
  post  "project_mgr/summaries" =>'project_mgr#summaries'


  get  "weekly_status_index" =>'weekly_status#index'

  match '/weekly_status_details/:id' => 'weekly_status#details', via: :get
  post  "magic_upload" =>'weekly_status#magic_upload'
  post  "weekly_status_upload" =>'weekly_status#upload'

  patch  "weekly_summary_update" =>'weekly_status#update'

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
