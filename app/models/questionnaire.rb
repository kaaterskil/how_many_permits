class Questionnaire < ActiveRecord::Base
  has_many :steps, through: :step_lines
  has_many :responses, through: :response_lines
end
