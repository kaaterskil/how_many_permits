class CreateResponseLines < ActiveRecord::Migration
  def change
    create_table :response_lines do |t|
      t.integer :questionnaire_id, null: false
      t.integer :response_id, null: false
    end
    add_index :response_lines, :questionnaire_id
    add_index :response_lines, :response_id
  end
end
