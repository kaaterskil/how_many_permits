class AddBranchStepToResponse < ActiveRecord::Migration
  def change
    add_column :responses, :must_branch, :boolean, null: false, default: false
    add_column :responses, :branch_step_id, :integer
    add_index :responses, :branch_step_id
  end
end
