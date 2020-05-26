WINDOWS ||= (java.lang.System.getProperties['os.name'] =~ /win/i)
require './lib/props/prop_loader'
require './lib/logging/logging'
require 'csv'
# require '../../db/comments_seed'
require './lib/roles/roles'
require './lib/unanet/unanet'
