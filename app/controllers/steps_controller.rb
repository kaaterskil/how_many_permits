class StepsController < ApplicationController
  respond_to :json

  def index
    render json: Step.all.order('category'), root: false
  end
end
