class Step < ActiveRecord::Base
  after_initialize :set_default_button_text, :if => :new_record?

  has_many :responses, inverse_of: :step

  validates :title, :text, :category, presence: true
  validates :category, inclusion: { in: :category_enum }

  def category_enum
    ['Information', 'Initial', 'General', 'Construction', 'Construction Specific','Business', 'Business Specific']
  end

  def set_default_button_text
    self.continue_btn_text ||= 'Next'
  end
end
