# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# require './db/comments_seed'


Facility.delete_all
facilities = ['New York', 'Los Angeles', 'Portland']
for facility in facilities
  Facility.create!(location: facility)
end

AppointmentType.delete_all
appointment_types = ['Allergist', 'Surgeon', 'Primary Care', 'Cardiologist']
for appt in appointment_types
  AppointmentType.create!(type_of_appointment: appt)
end

ALLERGIST = AppointmentType.where(type_of_appointment: 'Allergist').first
SURGEON = AppointmentType.where(type_of_appointment: 'Surgeon').first
PRIMARY_CARE = AppointmentType.where(type_of_appointment: 'Primary Care').first
CARDIOLOGIST = AppointmentType.where(type_of_appointment: 'Cardiologist').first

NEW_YORK = Facility.where(location: 'New York').first
LOS_ANGELES = Facility.where(location: 'Los Angeles').first
PORTLAND = Facility.where(location: 'Portland').first

Doctor.delete_all
# doctor_names = ['Dr. A', 'Dr. B', 'Dr. C', 'Dr. D', 'Dr. E', 'Dr. F', 'Dr. G', 'Dr. H']

doc_a = Doctor.new(name: 'Dr. A')
doc_a.appointment_type = ALLERGIST
doc_a.facility = NEW_YORK
doc_a.save!

doc_a = Doctor.new(name: 'Dr. Suess')
doc_a.appointment_type = ALLERGIST
doc_a.facility = NEW_YORK
doc_a.save!

doc_a = Doctor.new(name: 'Dr. Oz')
doc_a.appointment_type = ALLERGIST
doc_a.facility = NEW_YORK
doc_a.save!

doc_b = Doctor.new(name: 'Dr. B')
doc_b.appointment_type = SURGEON
doc_b.facility = NEW_YORK
doc_b.save!

doc_b = Doctor.new(name: 'Dr. who')
doc_b.appointment_type = SURGEON
doc_b.facility = NEW_YORK
doc_b.save!

doc_b = Doctor.new(name: 'Dr. McCoy')
doc_b.appointment_type = SURGEON
doc_b.facility = NEW_YORK
doc_b.save!

doc_c = Doctor.new(name: 'Dr. C')
doc_c.appointment_type = PRIMARY_CARE
doc_c.facility = NEW_YORK
doc_c.save!

doc_c = Doctor.new(name: 'Dr. Strange')
doc_c.appointment_type = PRIMARY_CARE
doc_c.facility = NEW_YORK
doc_c.save!

doc_d = Doctor.new(name: 'Dr. D')
doc_d.appointment_type = CARDIOLOGIST
doc_d.facility = NEW_YORK
doc_d.save!

doc_e = Doctor.new(name: 'Dr. E')
doc_e.appointment_type = ALLERGIST
doc_e.facility = LOS_ANGELES
doc_e.save!

doc_f = Doctor.new(name: 'Dr. F')
doc_f.appointment_type = SURGEON
doc_f.facility = LOS_ANGELES
doc_f.save!

doc_g = Doctor.new(name: 'Dr. G')
doc_g.appointment_type = PRIMARY_CARE
doc_g.facility = LOS_ANGELES
doc_g.save!

doc_h = Doctor.new(name: 'Dr. H')
doc_h.appointment_type = CARDIOLOGIST
doc_h.facility = LOS_ANGELES
doc_h.save!

doc_i = Doctor.new(name: 'Dr. I')
doc_i.appointment_type = ALLERGIST
doc_i.facility = PORTLAND
doc_i.save!

doc_j = Doctor.new(name: 'Dr. J')
doc_j.appointment_type = SURGEON
doc_j.facility = PORTLAND
doc_j.save!

doc_k = Doctor.new(name: 'Dr. K')
doc_k.appointment_type = PRIMARY_CARE
doc_k.facility = PORTLAND
doc_k.save!

doc_l = Doctor.new(name: 'Dr. L')
doc_l.appointment_type = CARDIOLOGIST
doc_l.facility = PORTLAND
doc_l.save!

