class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # Overloads the Devise method on successful log in
  def after_sign_in_path_for(user)
    if user && user.admin?
      rails_admin_path
    else
      super
    end
  end

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to main_app.root_path, :alert => exception.message
  end
end
