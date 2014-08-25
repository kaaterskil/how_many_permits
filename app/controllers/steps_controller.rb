class StepsController < ApplicationController
  respond_to :json

  def index
    render json: Step.all.order('is_default', 'category'), root: false
  end
end
