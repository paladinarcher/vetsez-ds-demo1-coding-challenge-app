require 'logging'
require 'fileutils'
require 'socket'

#if nil we are in trinidad
CATALINA_HOME = java.lang.System.properties['catalina.home']
subdir = (File.open('../context.txt').read.reverse.chop.reverse + '/') rescue ''
LOG_HOME = CATALINA_HOME.nil? ? "#{Rails.root}/logs/#{subdir}" : "#{CATALINA_HOME}/logs/#{subdir}"
FileUtils::mkdir_p LOG_HOME
Logging.basepath = Rails.root.to_s


module Logging
  #add a level here if needed....
  RAILS_COMMON_LEVELS = [:trace, :debug, :info, :warn, :error, :fatal, :unknown, :always]
  def self.trace(exception)
    trace_str = "\n"
    if exception.respond_to? :backtrace
      trace_str << exception.to_s << "\n"
      unless exception.backtrace.nil?
        trace_str << exception.backtrace.join("\n")
      end
    end
  end
end
#Logging.caller_tracing=true
Logging.init *Logging::RAILS_COMMON_LEVELS

Logging.color_scheme('pretty',
                     levels: {
                         :info => :green,
                         :warn => :yellow,
                         :error => :red,
                         :fatal => [:white, :on_red],
                         :unknown => [:yellow, :on_blue],
                         :always => :white
                     },
                     date: :yellow,
                     #logger: :cyan,
                     #message: :magenta,
                     file: :magenta,
                     line: :cyan
)

color_scheme = WINDOWS ? 'pretty' : :default

#move pattern to prop file
pattern = $PROPS['LOG.pattern']
Logging.appenders.stdout(
    'stdout',
    :layout => Logging.layouts.pattern(
        :pattern => pattern,
        :color_scheme => color_scheme
    )
)

rf = Logging.appenders.rolling_file(
    'file',
    layout: Logging.layouts.pattern(
        pattern: pattern,
        color_scheme: color_scheme,
    #    backtrace: true
    ),
    roll_by: $PROPS['LOG.roll_by'],
    keep: $PROPS['LOG.keep'].to_i,
    age: $PROPS['LOG.age'],
    filename: LOG_HOME + $PROPS['LOG.filename'],
    truncate: true
)

error_appender = Logging.appenders.rolling_file(
    'file',
    layout: Logging.layouts.pattern(
        pattern: pattern,
        color_scheme: color_scheme,
    ),
    roll_by: $PROPS['LOG.roll_by'],
    keep: $PROPS['LOG.keep'].to_i,
    age: $PROPS['LOG.age'],
    filename: LOG_HOME + $PROPS['LOG.filename_error'],
    truncate: true
)

class ErrorFilter < ::Logging::Filter

  def initialize
    @levels_hash = Logging::LEVELS.invert.map do |k,v| [k, v.to_sym] end.to_h
  end

  def allow(event)
    allowed = @levels_hash[event.level].eql?(:error) || @levels_hash[event.level].eql?(:fatal)
    allowed ? event : nil
  end

end
#error_appender.level = :error
error_appender.filters=ErrorFilter.new

begin

  $log = ::Logging::Logger['MainLogger']
  $log.caller_tracing=$PROPS['LOG.caller_tracing'].upcase.eql?('TRUE')

  $log.add_appenders 'stdout' if ($PROPS['LOG.append_stdout'].upcase.eql?('TRUE'))
  $log.add_appenders rf
  #$log.add_appenders error_appender
  $log.level = $PROPS['LOG.level'].downcase.to_sym

  unless $PROPS['LOG.filename_admin'].nil?

    #rf_rails is for rails logging
    rf_admin = Logging.appenders.rolling_file(
        'file',
        layout: Logging.layouts.pattern(
            pattern: pattern,
            color_scheme: color_scheme,
        #    backtrace: true
        ),
        roll_by: $PROPS['LOG.roll_by'],
        keep: $PROPS['LOG.keep'].to_i,
        age: $PROPS['LOG.age'],
        filename: LOG_HOME + $PROPS['LOG.filename_admin'],
        truncate: true
    )
    $alog = ::Logging::Logger['LogAdmin']
    $alog.caller_tracing=$PROPS['LOG.caller_tracing'].upcase.eql?('TRUE')

    $alog.add_appenders 'stdout' if $PROPS['LOG.append_stdout'].upcase.eql?('TRUE')
    $alog.add_appenders rf_admin
    $alog.level = $PROPS['LOG.level'].downcase.to_sym
  end

  ALL_LOGGERS = [$log, $alog].reject(&:nil?).freeze
  # these log messages will be nicely colored
  # the level will be colored differently for each message
  # PrismeLogEvent not visible yet
  unless (File.basename($0) == 'rake')
    ALL_LOGGERS.each {|e| e.always 'Logging started!'}
  end
rescue => ex
  warn "Logger failed to initialize.  Reason is #{ex.to_s}"
  warn ex.backtrace.join("\n")
  warn 'Shutting down the KOMET/PRISME web server!'
  java.lang.System.exit(1)
end

ALL_LOGGERS.each do |logger|
  logger.add_appenders error_appender
end

#WARNING, using these methods doesn't produce the correct file location in the logs.
ALL_LOGGERS.each do |logger|
  Logging::RAILS_COMMON_LEVELS.each do |level|
    method_name = ("#{level}_e").to_sym
    logger.define_singleton_method(method_name) do |message, exception|
      logger.send(level, message.to_s)
      if exception.respond_to? :backtrace
        logger.send(level, exception.to_s)
        logger.send(level, exception.backtrace.join("\n")) unless exception.backtrace.nil?
      end
    end
  end
end

module Kernel
  def LEX(message, exception)
    result = "#{message}\n#{exception.class}: #{exception.message}\n#{exception.backtrace&.join("\n")}" rescue message.to_s
    result
  end
  module_function :LEX
end
$log.always "Using color scheme #{color_scheme}, Rails mode is #{Rails.env}"
=begin
load('lib/logging/logging.rb')
$log.debug{LEX("I had a boo boo 2", ex)}
=end