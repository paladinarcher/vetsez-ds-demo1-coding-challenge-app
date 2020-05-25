module Roles
  module RoleTags
    CONTRIBUTOR_ROLE = :contributor
    PM_ROLE = :pm
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

  class InvalidRole < StandardError
  end

end