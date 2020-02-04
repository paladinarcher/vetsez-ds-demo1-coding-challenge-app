class LayoutsController < ApplicationController
  # this is the root route for the application
  def root
  end

  def form_inputs
    $log.always("Received " + params.inspect)
    render json: {recieved: params}
  end
end
