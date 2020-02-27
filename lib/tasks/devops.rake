require 'warbler'
require './lib/utilities'
require 'fileutils'
require "open3"

Rake::TaskManager.record_task_metadata = true
include Utilities
WINDOWS ||= (java.lang.System.getProperties['os.name'] =~ /win/i)


$UNVERSIONED = 'unversioned'

namespace :devops do
  def env(env_var, default)
    ENV[env_var].nil? ? default : ENV[env_var]
  end

  def version_to_rails_mode()
    version = ENV['PROJECT_VERSION'] #set by maven
    if (version.to_s.empty?)
      #I am running outside of maven
      mode = ENV['RAILS_ENV']
    else
      mode = 'production'
    end
    p "The version is #{version}" if version
    mode = 'production'
    if (version =~ /snapshot/i)
      mode = 'test'
    end
    p "Setting rails war to use #{mode}" unless (version.nil? || version.empty?) #no chatter when outside a maven build
    mode
  end


  default_name = to_snake_case(Rails.application.class.parent)
  context = env('RAILS_RELATIVE_URL_ROOT', "/#{default_name}")
  $maven_version = env('PROJECT_VERSION', $UNVERSIONED)
  ENV['RAILS_RELATIVE_URL_ROOT'] = env('RAILS_RELATIVE_URL_ROOT', "/#{default_name}")
  ENV['RAILS_ENV'] = version_to_rails_mode()
  ENV['NODE_ENV'] = 'production'

  slash = java.io.File.separator #or FILE::ALT_SEPARATOR
  $war_name = $maven_version.eql?($UNVERSIONED) ? default_name : "#{default_name}-#{$maven_version}"

  desc 'build maven\'s target folder if needed'
  task :maven_target do |task|
    Dir.mkdir(Utilities::MAVEN_TARGET_DIRECTORY) unless File.exists?(Utilities::MAVEN_TARGET_DIRECTORY)
  end

  desc 'build the context file'
  task :generate_context_file do |task|
    p task.comment
    p "context is #{context}"
    File.open("context.txt", 'w') {|f| f.write(context)}
  end

  desc 'build the version file'
  task :generate_version_file do |task|
    p task.comment
    p "version is #{$maven_version}"
    File.open("version.txt", 'w') {|f| f.write($maven_version)}
  end

  desc 'run Jest tests'
  task :jest_tests do |task|
    p task.comment
    node_env = ENV['NODE_ENV']
    ENV['NODE_ENV']=nil #leave production, force all dev packages for test
    sh 'yarn install' #during the build war phase webpacker's yarn install will clobber this cruft before the war is produced, but the tests need it.
    sh 'yarn test'
    ENV['NODE_ENV'] = node_env
  end

  desc 'run eslint'
  task :lint_react do |task|
    p task.comment
    node_env = ENV['NODE_ENV']
    ENV['NODE_ENV']=nil #leave production, force all dev packages for test
    sh 'yarn install'
    rundir = Rails.root.to_s.gsub('/',slash)
    if WINDOWS
      command = "cd #{rundir} && .\\eslint.bat"
    else
      command = "cd #{rundir} && ./node_modules/.bin/eslint -o ./react_lint/eslint.html -f html --ext jsx ./app/frontend/packs/." #produce file for sonarqube
    end
    puts command
    Open3.popen3({},command) do |stdin, stdout, stderr, waith_thr|
      error = stderr.read.to_s
      raise "Eslint failed to run!\n #{error}" unless error.empty?
      puts stdout.read #should be empty
      ENV['NODE_ENV'] = node_env
    end
   # sh command #Eslint doesn't support quiet exits: https://github.com/eslint/eslint/issues/2949
  end
 # cd C:\work\digital_services_bpa\vetsez-ds-demo1-coding-challenge-app && C:\work\digital_services_bpa\vetsez-ds-demo1-coding-challenge-app\target\rubygems\bin\rubocop --fail-level fatal --format html --out rubo_lint\rubocop.html
  desc 'run rubocop'
  task :lint_rubocop do |task|
    p task.comment
    rundir = Rails.root.to_s
    output_file = "#{rundir}/rubo_lint/rubocop.html"
    scripting_container = org.jruby.embed.ScriptingContainer.new
    args = "--fail-level error --format html --out #{output_file}".split
    script = File.read("#{ENV['GEM_HOME']}/bin/rubocop")#jruby generated windows bat file doesn't actually work
    scripting_container.setCurrentDirectory(rundir)
    scripting_container.put("ARGV", args)
    exit_code = scripting_container.runScriptlet(script)
    raise "RuboCop found errors too severe to continue! Please see #{output_file}" unless (exit_code == 0)
  end



  #running in devops.rake ensures the rails environment is test for snapshost builds and production for releases
  desc 'run migrations'
  task :migrations do |task|
    p task.comment
    puts "Running migrations for #{ENV['RAILS_ENV']}"
    Rails.env = ENV['RAILS_ENV']
    Rake::Task['db:migrate'].invoke() #rake db:migrate RAILS_ENV=test
  end

  #running in devops.rake ensures the rails environment is test for snapshost builds and production for releases
  desc 'run seeds'
  task :seed => :environment do |task|
    p task.comment
    ActiveRecord::Base.establish_connection(:test)
    puts "Running seeds for test"
    Rake::Task['db:seed'].invoke() #rake db:migrate RAILS_ENV=test
  end

  desc 'put jruby in debug mode'
  task :debug_jruby_for_tests do |task|
    p task.comment
    debug_file = "#{Rails.root}/.jrubyrc".gsub('/',slash) #work on windows
    File.open(debug_file, 'w') { |file| file.write("debug.fullTrace=true") }
  end
  desc 'run rails tests and eliminate debug mode'
  task :rails_tests do |task|
    p task.comment
    puts "inside rails_tests: env is #{Rails.env}"
    debug_file = "#{Rails.root}/.jrubyrc".gsub('/',slash) #work on windows
    #Rails.env = ENV['RAILS_ENV']
    Rake::Task['test'].invoke
    File.delete(debug_file) if File.exist?(debug_file)
  end

  # seed the menu options
  # Building db-init
  # Step 1/7 : FROM jruby:9.2.8
  #  ---> 870bb631749c
  # Step 2/7 : ENV RAILS_ENV=production
  desc 'hook into docker flow for db setup'
  task :db_setup_for_docker => :environment do |task|
    p "rails env in db_setup_for_docker is #{ENV['RAILS_ENV']}"
    Rake::Task['db:migrate'].invoke()
    Rake::Task['db:seed'].invoke()
  end

  desc 'compile and lint assets/ruby'
  task :build_assets do |task|
    p "rails env in build_assets is #{ENV['RAILS_ENV']}"
    Rake::Task['webpacker:check_yarn'].invoke
    Rake::Task['devops:lint_react'].invoke
    Rake::Task['devops:lint_rubocop'].invoke
    Rake::Task['webpacker:yarn_install'].invoke
    Rake::Task['devops:compile_assets'].invoke
  end

  desc 'Build war file'
  task :build_war do |task|
    p task.comment
    # Delete old war files
    old_war_files = Dir.glob(File.join("target", "*.war"))
    old_war_files.each do |war|
      File.delete(war)
    end
    Rake::Task['devops:maven_target'].invoke
    Rake::Task['devops:generate_context_file'].invoke
    Rake::Task['devops:generate_version_file'].invoke
    # Rake::Task['devops:create_version'].invoke
    #sh "warble"
    Warbler::Task.new
    Rake::Task['war'].invoke
  end

  desc 'Compile assets'
  task :compile_assets do |task|
    p task.comment
    p "rails env is #{ENV['RAILS_ENV']}"
    Rake::Task['assets:clobber'].invoke
    Rake::Task['assets:precompile'].invoke()
  end

  desc 'Install bundle'
  task :bundle do |task|
    p task.comment
    sh 'bundle install'
  end


end

class Webpacker::Compiler
  def run_webpack
    @app_path          = File.expand_path(".", Dir.pwd)
    @node_modules_path = File.join(@app_path, "node_modules")
    @webpack_config    = File.join(@app_path, "config/webpack/#{ENV["NODE_ENV"]}.js")
    env = { "NODE_PATH" => @node_modules_path.shellescape }
    cmd = [ "#{@node_modules_path}/.bin/webpack", "--config", @webpack_config ]
    logger.info "Running the command: #{cmd.join(' ')}"
    system env, *cmd
    if $?.success?
      logger.info "Compiled all packs in #{config.public_output_path}"
    else
      logger.error "Compilation failed:\n#{$?}"
    end
    $?.success?
  end
end
