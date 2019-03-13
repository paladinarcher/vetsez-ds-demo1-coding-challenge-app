begin
  #ActiveRecord::Migrator.migrate 'db/migrate'
rescue => ex
  puts "Migration failed. #{ex.message}"
end