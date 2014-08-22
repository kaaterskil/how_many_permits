class StepLine < ActiveRecord::Base
  belongs_to :questionnaire
  belongs_to :step
end
