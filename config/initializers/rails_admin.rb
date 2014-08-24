RailsAdmin.config do |config|

  config.main_app_name = ['What Permits Do I Need?', 'Back Office']

  ### Popular gems integration

  ## == Devise ==
  config.authenticate_with do
    warden.authenticate! scope: :user
  end
  config.current_user_method(&:current_user)

  ## == Cancan ==
  config.authorize_with :cancan

  ## == PaperTrail ==
  config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration

  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    new
    export
    bulk_delete
    show
    edit
    delete
    show_in_app

    ## With an audit adapter, you can add:
    # history_index
    # history_show
  end

  config.excluded_models = ['StepLine', 'ResponseLine']

  config.model Step do
    exclude_fields :created_at, :updated_at
    field :continue_btn_text do
      label 'Continue Button Text'
    end
  end

  config.model Response do
    parent Step
    exclude_fields :created_at, :updated_at
    field :check_box_text do
      label 'Question Checkbox Text'
    end
  end

  config.model Questionnaire do
    # include_all_fields
  end

  config.model User do
    include_fields :email, :role, :last_sign_in_at
  end
end
