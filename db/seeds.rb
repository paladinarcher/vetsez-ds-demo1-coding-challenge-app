# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
# require './db/comments_seed'
User.delete_all

User.create!(email: 'ab@example.com', password: 'password1')
User.create!(email: 'cd@example.com', password: 'password2')