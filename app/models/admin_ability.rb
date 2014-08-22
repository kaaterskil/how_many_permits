class AdminAbility
  include CanCan::Ability

  def initialize
    if user && user.role == 'admin'
      can :access, :rails_admin
      can :manage, :all
    end
  end
end
