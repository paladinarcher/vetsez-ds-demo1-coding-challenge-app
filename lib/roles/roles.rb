module Roles
  module RoleTags
    CONTRIBUTOR_ROLE = :contributor
    PM_ROLE = :pm
    SENIOR_PM_ROLE = :senior_pm
    ADMIN_ROLE = :admin
  end
  ALL_ROLES = RoleTags.constants.map do |constant|
    Roles::RoleTags.const_get(constant)
  end

# Roles::Metadata::ALL_ROLES
  def valid_role?(role)
    Roles::ALL_ROLES.include?(role)
  end

  def valid_role!(role)
    raise InvalidRole.new("#{role} is not a valid role.  Valid roles are #{Roles::ALL_ROLES}") unless valid_role? role
    true
  end

  def verify_user_in_role!
    method = self.action_name + '_roles' #CallChain.caller_method + '_roles'
    has_role = false
    Annotate.methods_and_roles[self.class] ||= {}
    if Roles::Annotate.methods_and_roles[self.class][method].nil?
      #we assume we only care about CONTRIBUTOR_ROLE
      has_role = has_role || current_user.has_role?(RoleTags::CONTRIBUTOR_ROLE)
    else
      Roles::Annotate.methods_and_roles[self.class][method].each do |role|
        has_role = has_role || current_user.has_role?(role)
      end
    end
    raise NotInRole.new("The user #{current_user.email} does not have the required roles!") unless has_role
  end

  class NotInRole < StandardError
  end
  class InvalidRole < StandardError
  end

  module Annotate
    def method_missing(m, *args, &block)
      if m.to_s.split('_').last.eql? 'roles'
        args.each do |e|
          Annotate.methods_and_roles[self] ||= {}
          args.map do |e|
            e.to_s.to_sym
          end
          Annotate.methods_and_roles[self][m.to_s] = args
        end
      else
        super
      end
    end

    class << self
      attr_accessor :methods_and_roles
    end
    Annotate.methods_and_roles ||= {}
  end

end