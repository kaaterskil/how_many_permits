class AddRoleToUser < ActiveRecord::Migration
  def change
    add_column :users, :role, :string, null: false, default: 'visitor'
    add_index :users, :role
  end
end
