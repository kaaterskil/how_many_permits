class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.string :title, null: false
      t.string :category, null: false
      t.text :text
      t.string :continue_btn_text
      t.boolean :is_default, null: false, default: false
    end
    add_index :steps, :category
    add_index :steps, :is_default
  end
end
