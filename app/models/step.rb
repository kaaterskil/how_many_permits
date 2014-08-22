class Step < ActiveRecord::Base
  CATEGORIES = %w[Information Initial General Construction Business Types]

  has_many :responses, inverse_of: :step

  validates :title, :text, :category, presence: true
  validates :category, inclusion: { in: CATEGORIES }

  def category_enum
    ['information', 'initial', 'general', 'construction', 'business', 'business_type']
  end
end
