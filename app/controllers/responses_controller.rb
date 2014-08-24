class ResponsesController < ApplicationController
  respond_to :json

  def index
    render json: Response.all, root: false
  end
end
