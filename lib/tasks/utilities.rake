namespace :utilties do
  #running in devops.rake ensures the rails environment is test for snapshost builds and production for releases
  desc 'encrypt password'
  task :encrypt_password => :environment do |task|
    p task.comment
    password = ARGV[1].chomp
    puts "Encrypting -->#{password}<---"
    ARGV.each { |a| task a.to_sym do ; end }
    puts User.new(:password => password).encrypted_password
  end

end
