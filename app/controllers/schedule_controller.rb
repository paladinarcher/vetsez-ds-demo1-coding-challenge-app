class ScheduleController < ApplicationController
  def get_facilities
    render json: {data: [{id: 1, location: 'New York'}, {id: 2, location: 'Los Angeles'}, {id: 3, location: 'Portland'}]}
  end

  def get_appointment_types
    render json: {data: [{id: 1, type: 'Allergist'},{id: 2, type: 'Dermatologist'}]}
  end

  def get_user
  end
end
