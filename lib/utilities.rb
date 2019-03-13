require 'uri'

module Utilities
  TMP_FILE_PREFIX = './tmp/'
  YML_EXT = '.yml'
  MAVEN_TARGET_DIRECTORY = './target'
  ##
  # this method takes a camel cased word and changes it to snake case
  # Example: RailsKomet -> rails_komet
  #
  def to_snake_case(camel_cased_word)
    camel_cased_word.to_s.gsub(/::/, '/').
        gsub(/([A-Z]+)([A-Z][a-z])/, '\1_\2').
        gsub(/([a-z\d])([A-Z])/, '\1_\2').
        tr('-', '_').
        downcase
  end

  ##
  # writes the json data to a tmp file based on the filename passed
  # @param json - the JSON data to write out
  # @param file_name - the filename to write out to the /tmp directory
  def json_to_yaml_file(json, file_name)
    if Rails.env.development?
      prefix = '#Fixture created on ' + Time.now.strftime('%F %H:%M:%S') + "\n"
      File.write("#{TMP_FILE_PREFIX}#{file_name}" + YML_EXT, prefix + json.to_yaml)
      #$log.trace("Writing yaml file #{TMP_FILE_PREFIX}#{file_name}.yml.")
    else
      #$log.trace("Not writing yaml file #{TMP_FILE_PREFIX}#{file_name}.yml. Rails.env = #{Rails.env}")
    end

  end

  ##
  # Convert the URL to a string for use with the json_to_yaml_file method call
  # @param url - the URL path to convert to a string with underscores
  # @return - the filename based on the URL passed
  def url_to_path_string(url)
    url = url.clone
    begin
      url.gsub!('{', '') #reduce paths like http://www.google.com/foo/{id}/faa to http://www.google.com/foo/id/faa
      url.gsub!('}', '') #reduce paths like http://www.google.com/foo/{id}/faa to http://www.google.com/foo/id/faa
      path = URI(url).path.gsub('/', '_')
      path = 'no_path' if path.empty?
      return path
    rescue => ex
      #$log.error('An invalid matched_url was given!')
      #$log.error(ex)
    end
    'bad_url'
  end
end

module Kernel
  TRUE_VALS = %w(true t yes y on 1)
  FALSE_VALS = %w(false f no n off 0)

  def boolean(boolean_string)
    val = boolean_string.to_s.downcase.gsub(/\s+/, '')
    return false if val.empty?
    return true if TRUE_VALS.include?(val)
    return false if FALSE_VALS.include?(val)
    raise ArgumentError.new("invalid value for Boolean: \"#{val}\"")
  end

  def gov
    Java::Gov
  end

end

class String
  # similar to the camelize in rails, but it only mutates the first character after the underscore
  # Suppose you have the java method 'getInterfaceEngineURL', note how the last set of characters are all uppercase
  # "interface_engine_URL".camelize() => "InterfaceEngineUrl"
  # "interface_engine_URL".camelize_preserving => "InterfaceEngineURL"
  # "interface_engine_URL".camelize_preserving(false) => "interfaceEngineURL"
  def camelize_preserving(modify_first_letter = true)
    return self.split('_').each_with_index.collect do |e, i|
      if ((i == 0) && !modify_first_letter)
      else
        e[0] = e[0].capitalize
      end
      e
    end.join
  end

  def to_b
    boolean(self)
  end

  def os_path!
    self.gsub!('/', java.io.File::separator)
    self.gsub!('\\', java.io.File::separator)
  end
end

module JSON
  class << self
    def indifferent_parse(source, opts = {})
      HashWithIndifferentAccess.new(JSON.parse(source, opts))
    end
  end
end

module FileHelper
  def FileHelper.file_as_string(file)
    rVal = ''
    File.open(file, 'r') do |file_handle|
      file_handle.read.each_line do |line|
        rVal << line
      end
    end
    rVal
  end
end