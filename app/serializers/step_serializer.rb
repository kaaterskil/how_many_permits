class StepSerializer < ActiveModel::Serializer
  attributes :id, :title, :category, :text, :continue_btn_text, :is_default
end
