class ResponseSerializer < ActiveModel::Serializer
  attributes :id, :step_id, :title, :text, :next_step_id, :required_permit, :result_text, :result_resources, :check_box_text, :must_branch, :branch_step_id
end
