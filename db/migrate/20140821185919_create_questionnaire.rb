class CreateQuestionnaire < ActiveRecord::Migration
  def change
    create_table :questionnaires do |t|
      t.integer :user_id, null: false
      t.string :title

      t.timestamps
    end
    add_index :questionnaires, :user_id
  end
end
