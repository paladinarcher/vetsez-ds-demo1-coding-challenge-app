WINDOWS ||= (java.lang.System.getProperties['os.name'] =~ /win/i)
require './lib/props/prop_loader'
require './lib/logging/logging'
# require '../../db/comments_seed'

begin
  Facility.delete_all
  facilities = ['New York', 'Los Angeles', 'Portland']
  for facility in facilities
    Facility.create(location: facility).save!
  end

  AppointmentType.delete_all
  appointmentment_types = ['Allergist', 'Surgeon', 'Primary Care', 'Cardiologist']
  for appt in appointmentment_types
    AppointmentType.create(type_of_appointment: appt).save!
  end
rescue => ex
  $log.error(LEX("Seeding of appointment types and facilities failed", ex))
end
