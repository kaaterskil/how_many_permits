class Response < ActiveRecord::Base
  belongs_to :step

  validates :step, presence: true
  validates :title, :text, presence: true;
end
