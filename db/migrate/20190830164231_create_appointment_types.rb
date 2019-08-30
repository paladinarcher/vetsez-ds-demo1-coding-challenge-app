class CreateAppointmentTypes < ActiveRecord::Migration[5.2]
  def change
    create_table :appointment_types do |t|
      t.string :type_of_appointment

      t.timestamps
    end
  end
end
