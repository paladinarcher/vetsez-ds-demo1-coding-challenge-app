class UsersController < ApplicationController
  def index
    puts "inside user controller: index"
    users = User.all
    render json: users
  end

  def create
    User.create!(params[:user])
  end

  def show
    user = User.find(params[:id])
  end

  def destroy
    user = User.find(params[:id])
    user.delete
  end
end
