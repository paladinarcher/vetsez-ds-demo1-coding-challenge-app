class LayoutsController < ApplicationController
  # this is the root route for the application
  def root
  end

  def form_inputs
    render json: {recieved: params}
  end
end
