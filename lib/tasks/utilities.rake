namespace :utilities do

  CREATE_USER_STMT = %q(insert into users (email, encrypted_password, created_at, updated_at) values ('EMAIL_ADDRESS', 'HASHED_PASSWORD',now(), now());)
  UPDATE_USER_STMT =%q(update users set encrypted_password = 'HASHED_PASSWORD' where email = 'EMAIL_ADDRESS';)
  VALID_EMAIL = URI::MailTo::EMAIL_REGEXP

  def hash_password_usage
    puts "Invoke as follows:"
    puts "rake utilities:hash_password['mySecretPassword']"
    exit 0;
  end

  def create_insert_usage
    puts "Invoke as follows:"
    puts "rake utilities:create_insert['bob@bob.com', mySecretPassword']"
    exit 0;
  end

  def verify_password(password)
    raise "Password must be at least 6 characters" unless (password.length >= 6)
  end

  def verify_email(email)
    raise "Please enter a valid email" unless VALID_EMAIL.match(email)
  end

  def process_args(args)
    hash_me = args[:password]
    user_email = args[:user_email]
    create_insert_usage if (hash_me.to_s.empty? || user_email.to_s.empty?)
    verify_password(hash_me)
    verify_email(user_email)
    user = User.new(:password => hash_me.chomp)
    [user_email,user.encrypted_password]
  end

  desc 'produce encrypted password'
  task :hash_password,[:password] => [:environment] do |task, args|
    p task.comment
    hash_me = args[:password]
    hash_password_usage if hash_me.to_s.empty?
    verify_password(hash_me)
    puts "Hashing: #{hash_me}"
    user = User.new(:password => hash_me.chomp)
    puts user.encrypted_password
  end

  desc 'produce create new user statement'
  task :create_user,[:user_email, :password] => [:environment] do |task, args|
    p task.comment
    user_email, hashed = process_args(args)
    puts '---------------STATEMENT_BELOW---------------'
    puts CREATE_USER_STMT.gsub('EMAIL_ADDRESS', user_email).gsub('HASHED_PASSWORD', hashed)
    puts '---------------STATEMENT_ABOVE---------------'
  end

  desc 'produce update user password statement'
  task :update_user,[:user_email, :password] => [:environment] do |task, args|
    p task.comment
    user_email, hashed = process_args(args)
    puts '---------------STATEMENT_BELOW---------------'
    puts UPDATE_USER_STMT.gsub('EMAIL_ADDRESS', user_email).gsub('HASHED_PASSWORD', hashed)
    puts '---------------STATEMENT_ABOVE---------------'
  end
end