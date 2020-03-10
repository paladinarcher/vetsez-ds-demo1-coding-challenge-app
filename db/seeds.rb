# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# require './db/comments_seed'
# 
# 
User.delete_all

User.create!(first_name: 'foo', last_name: 'bar', email: 'foo@bar.com', password: 'password1')
User.create!(first_name: 'moo', last_name: 'car', email: 'moo@car.com', password: 'password2')
User.create!(first_name: 'coo', last_name: 'far', email: 'coo@far.com', password: 'password3')
User.create!(first_name: 'too', last_name: 'nar', email: 'too@nar.com', password: 'password4')
User.create!(first_name: 'ert', last_name: 'nji', email: 'ert@nji.com', password: 'password5')


