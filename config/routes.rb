Rails.application.routes.draw do
  get 'get_facilities' => 'schedule#get_facilities'
  get 'get_appointment_types' => 'schedule#get_appointment_types'
  get 'get_doctors' => 'schedule#get_doctors'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root :to => 'layouts#root'

end
