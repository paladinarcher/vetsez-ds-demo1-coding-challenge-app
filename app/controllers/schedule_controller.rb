class ScheduleController < ApplicationController
  def get_facilities
    # data = Facility.all
    data = [{id: 1, location: 'New York'}, {id: 2, location: 'Los Angeles'}, {id: 3, location: 'Portland'}]
    $log.info{"Get facilities is returning #{data.inspect}"}
    render json: data
  end

  def get_appointment_types
    # appointment_types = AppointmentType.all
    appointment_types = [{id: 1, type: 'Allergist'}, {id: 2, type: 'Surgeon'}, {id: 3, type: 'Primary Care'}, {id:4, type: 'Cardiologist'}]
    $log.info{"Get appointment types is returning #{appointment_types.inspect}"}
    render json: appointment_types
  end

=begin
  def get_doctors
    facility_id = params[:facility_id]
    appointment_type_id = params[:appointment_type_id]

    list = Doctor.where(appointment_type_id: appointment_type_id, facility_id: facility_id).all.to_a
    $log.info{"Get doctors is returning #{list.inspect}"}

    render json: list
  end
=end

end
