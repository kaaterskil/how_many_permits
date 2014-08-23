class Response < ActiveRecord::Base
  belongs_to :step, inverse_of: :responses
  belongs_to :next_step, class_name: 'Step', foreign_key: 'next_step_id'
  belongs_to :branch_step, class_name: 'Step', foreign_key: 'branch_step_id'

  validates :step, presence: true
  validates :title, presence: true;
  validates_with BranchValidator
end
