class CreateResponses < ActiveRecord::Migration
  def change
    create_table :responses do |t|
      t.integer :step_id, null: false
      t.string :title, null: false
      t.text :text
      t.integer :next_step_id
      t.string :required_permit
      t.text :result_text
      t.text :result_resources
    end
    add_index :responses, :step_id
    add_index :responses, :next_step_id
    add_index :responses, :required_permit
  end
end
