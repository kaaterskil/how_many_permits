class ResponseLine < ActiveRecord::Base
  belongs_to :questionnaire
  belongs_to :response
end
