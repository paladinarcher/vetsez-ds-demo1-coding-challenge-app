require 'warbler'
require './lib/utilities'
require 'fileutils'
require "open3"

Rake::TaskManager.record_task_metadata = true
include Utilities


$UNVERSIONED = 'unversioned'

namespace :devops do
  def env(env_var, default)
    ENV[env_var].nil? ? default : ENV[env_var]
  end

  def version_to_rails_mode(version)
    p "The version is #{version}"
    mode = 'production'
    if (version =~ /snapshot/i)
      mode = 'test'
    end
    p "Setting rails war to use #{mode}" unless (version.nil? || version.empty?) #no chatter when outside a maven build
    mode
  end


  default_name = to_snake_case(Rails.application.class.parent)
  default_war = "#{default_name}.war"
  context = env('RAILS_RELATIVE_URL_ROOT', "/#{default_name}")
  $maven_version = env('PROJECT_VERSION', $UNVERSIONED)
  ENV['RAILS_RELATIVE_URL_ROOT'] = env('RAILS_RELATIVE_URL_ROOT', "/#{default_name}")
  ENV['RAILS_ENV'] = version_to_rails_mode(ENV['PROJECT_VERSION'])
  ENV['NODE_ENV'] = 'production'

  slash = java.io.File.separator #or FILE::ALT_SEPARATOR
  src_war = "#{Utilities::MAVEN_TARGET_DIRECTORY}#{slash}#{Rails.application.class.parent_name.to_s.downcase}.war"
  tomcat_war_dst = "#{ENV['TOMCAT_DEPLOY_DIRECTORY']}"
  app_name = Rails.application.class.parent_name.to_s.downcase
  tomcat_war = "#{tomcat_war_dst}#{slash}#{app_name}.war"
  tomcat_base_dir = "#{tomcat_war_dst}#{slash}..#{slash}"
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

  #running in devops.rake ensures the rails environment is test for snapshost builds and production for releases
  desc 'run migrations'
  task :migrations do |task|
    p task.comment
    puts "Running migrations for #{ENV['RAILS_ENV']}"
    Rake::Task['db:migrate'].invoke("RAILS_ENV=#{ENV['RAILS_ENV']}") #rake db:migrate RAILS_ENV=test
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
    Rake::Task['webpacker:check_yarn'].invoke
    Rake::Task['webpacker:yarn_install'].invoke
    Rake::Task['devops:compile_assets'].invoke
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
