require 'erb'

module PropLoader
  extend self

  class << self
    attr_accessor :props
  end

  def self.load_prop_files(*dirs)
    @props = {}
    dirs.each do |dir|
      # iterate over all of the .properties files in the directory
      Dir.glob("#{dir}/*.properties*") do |file|
        key_prefix = File.basename(file).split(".")[0].upcase

        if File.extname(file).eql?('.erb')
          props = self.read_props_from_erb(file, key_prefix)
        else
          # read the file line by line stripping out properties
          props = read_prop_file(file, key_prefix)
        end
        @props.merge!(props)
      end
    end
  end

  def self.reload
    PropLoader.load_prop_files('./config/props')
    $PROPS = PropLoader.props.clone
    $PROPS.freeze
  end

  private
  def self.read_prop_file(file, key_prefix)
    ret = {}

    File.readlines(file).each do |line|
      r = read_prop_line(line, key_prefix)
      ret.merge!(r)
    end
    ret
  end

  def self.read_props_from_erb(erb, key_prefix)
    props = ERB.new(File.open(erb, 'r') { |file| file.read }).result
    properties = {}
    prop_array = props.split("\n")
    prop_array.each do |line|
      properties.merge!(read_prop_line(line, key_prefix))
    end
    properties
  end

  def self.read_prop_line(line, key_prefix)
    properties = {}
    line.strip!
    return properties if line.eql?("")
    if (line[0] != ?# and line[0] != ?=)
      i = line.index('=')
      if (i)
        properties["#{key_prefix}." + line[0..i - 1].strip] = line[i + 1..-1].strip
      else
        properties["#{key_prefix}."+line] = ''
      end
    end
    properties
  end
end

PropLoader.reload
