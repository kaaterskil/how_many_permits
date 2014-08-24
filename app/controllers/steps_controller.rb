class StepsController < ApplicationController
  respond_to :json

  def index
    render json: Step.all.order('id'), root: false
  end
end
