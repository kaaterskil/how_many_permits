# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140822180341) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "questionnaires", force: true do |t|
    t.integer  "user_id",    null: false
    t.string   "title"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "questionnaires", ["user_id"], name: "index_questionnaires_on_user_id", using: :btree

  create_table "response_lines", force: true do |t|
    t.integer "questionnaire_id", null: false
    t.integer "response_id",      null: false
  end

  add_index "response_lines", ["questionnaire_id"], name: "index_response_lines_on_questionnaire_id", using: :btree
  add_index "response_lines", ["response_id"], name: "index_response_lines_on_response_id", using: :btree

  create_table "responses", force: true do |t|
    t.integer "step_id",                          null: false
    t.string  "title",                            null: false
    t.text    "text"
    t.integer "next_step_id"
    t.string  "required_permit"
    t.text    "result_text"
    t.text    "result_resources"
    t.string  "check_box_text"
    t.boolean "must_branch",      default: false, null: false
    t.integer "branch_step_id"
  end

  add_index "responses", ["branch_step_id"], name: "index_responses_on_branch_step_id", using: :btree
  add_index "responses", ["next_step_id"], name: "index_responses_on_next_step_id", using: :btree
  add_index "responses", ["required_permit"], name: "index_responses_on_required_permit", using: :btree
  add_index "responses", ["step_id"], name: "index_responses_on_step_id", using: :btree

  create_table "step_lines", force: true do |t|
    t.integer "questionnaire_id", null: false
    t.integer "step_id",          null: false
  end

  add_index "step_lines", ["questionnaire_id"], name: "index_step_lines_on_questionnaire_id", using: :btree
  add_index "step_lines", ["step_id"], name: "index_step_lines_on_step_id", using: :btree

  create_table "steps", force: true do |t|
    t.string  "title",                             null: false
    t.string  "category",                          null: false
    t.text    "text"
    t.string  "continue_btn_text"
    t.boolean "is_default",        default: false, null: false
  end

  add_index "steps", ["category"], name: "index_steps_on_category", using: :btree
  add_index "steps", ["is_default"], name: "index_steps_on_is_default", using: :btree

  create_table "users", force: true do |t|
    t.string   "email",                  default: "",        null: false
    t.string   "encrypted_password",     default: "",        null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,         null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "role",                   default: "visitor", null: false
    t.string   "last_sign_in_ip"
    t.string   "current_sign_in_ip"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree
  add_index "users", ["role"], name: "index_users_on_role", using: :btree

  create_table "versions", force: true do |t|
    t.string   "item_type",  null: false
    t.integer  "item_id",    null: false
    t.string   "event",      null: false
    t.string   "whodunnit"
    t.text     "object"
    t.datetime "created_at"
  end

  add_index "versions", ["item_type", "item_id"], name: "index_versions_on_item_type_and_item_id", using: :btree

end
