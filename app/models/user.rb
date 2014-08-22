class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  ROLES = %w[visitor admin]

  before_create :set_default_role

  has_many :questionnaires

  def set_default_role
    self.role ||= :visitor
  end
end
