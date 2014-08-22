class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :questionnaires

  ROLES = %w[visitor, admin]

  after_initialize :set_default_role, :if => :new_record?

  def set_default_role
    self.role ||= 'visitor'
  end

  def admin?
    return self.role == 'admin'
  end
end
