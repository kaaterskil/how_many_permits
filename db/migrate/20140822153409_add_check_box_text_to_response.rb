class AddCheckBoxTextToResponse < ActiveRecord::Migration
  def change
    add_column :responses, :check_box_text, :string
  end
end
