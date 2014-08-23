class BranchValidator < ActiveModel::Validator
  def validate(record)
    if (!record.branch_step.nil? && !record.must_branch)
      record.errors[:base] << 'Must Branch must be checked'
    elsif (record.branch_step.nil? && record.must_branch)
      record.errors[:base] << 'A branch step must be selected'
    end
  end
end
