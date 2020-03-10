puts "inside session controller file"

class SessionsController < ApplicationController
  puts "inside session controller class"
  skip_before_action :setup_gon
  
  def create
    puts "inside session controller : create action"
    user = User
            .find_by(email: params["user"]["email"])
            .try(:authenticate, params["user"]["password"])

    if user
      session[:user_id] = user.id
     
      redirect_to user_url(user.id)
    else
      user = User.create!(first_name: params["user"]["first_name"], last_name: params["user"]["last_name"], email: params["user"]["email"], password: params["user"]["password"])
      puts "new user created: #{user}"
      session[:user_id] = user.id
      puts "new session created: #{session[:user_id]}"
      redirect_to user_url(user.id)
    end
  end # end of create action
end # end of class
