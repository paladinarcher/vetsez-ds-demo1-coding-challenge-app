class User < ApplicationRecord
  # NotAuthorized = 'NotAuthorized' cris
  include Roles
  rolify
  after_create :assign_default_roles

  DEFAULT_ROLES = YAML.load(File.read("./config/default_roles.yml"))

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  def assign_default_roles
    self.add_role(RoleTags::CONTRIBUTOR_ROLE) if self.roles.blank?
    add_defined_defaults
  end

  private

  def add_defined_defaults
    if (DEFAULT_ROLES.keys.include?(self.email))
      DEFAULT_ROLES[self.email].each do |role|
        valid_role! role.to_s.to_sym
        self.add_role role.to_s.to_sym
      end
    end
  end



end
=begin
  current_user.has_role? RoleTags::CONTRIBUTOR
  # must
  # include Roles
  # to see RoleTags
greg = User.find_by_id 9
greg.roles.first.name
=> "contributor"
greg.roles.last.name
"admin"
=end