class ScheduleController < ApplicationController
  def get_facilities
    data = Facility.all
    # data = [{id: 1, location: 'New York'}, {id: 2, location: 'Los Angeles'}, {id: 3, location: 'Portland'}]
    $log.info{"Get facilities is returning #{data.inspect}"}
    render json: data
  end

  def get_appointment_types
    appointment_types = AppointmentType.all
    # appointment_types = [{id: 1, type: 'Allergist'}, {id: 2, type: 'Surgeon'}, {id: 3, type: 'Primary Care'}, {id:4, type: 'Cardiologist'}]
    $log.info{"Get appointment types is returning #{appointment_types.inspect}"}
    render json: appointment_types
  end
  
end
