class CreateStepLines < ActiveRecord::Migration
  def change
    create_table :step_lines do |t|
      t.integer :questionnaire_id, null: false
      t.integer :step_id, null: false
    end
    add_index :step_lines, :questionnaire_id
    add_index :step_lines, :step_id
  end
end
