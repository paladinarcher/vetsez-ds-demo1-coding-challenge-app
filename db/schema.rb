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

ActiveRecord::Schema.define(version: 2020_05_22_181538) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "roles", force: :cascade do |t|
    t.string "name"
    t.string "resource_type"
    t.bigint "resource_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name", "resource_type", "resource_id"], name: "index_roles_on_name_and_resource_type_and_resource_id"
    t.index ["resource_type", "resource_id"], name: "index_roles_on_resource_type_and_resource_id"
  end

  create_table "unanet_csv_uploads", force: :cascade do |t|
    t.string "user_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "approved", default: false
    t.index ["approved"], name: "index_users_on_approved"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "users_roles", id: false, force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "role_id"
    t.index ["role_id"], name: "index_users_roles_on_role_id"
    t.index ["user_id", "role_id"], name: "index_users_roles_on_user_id_and_role_id"
    t.index ["user_id"], name: "index_users_roles_on_user_id"
  end

  create_table "weekly_status_details", force: :cascade do |t|
    t.bigint "weekly_status_id"
    t.string "person_last_name"
    t.string "person_first_name"
    t.string "person_email_id"
    t.string "person_timesheet_approval_group_name"
    t.string "person_default_pay_code"
    t.string "timesheet_cell_project_code"
    t.string "timesheet_cell_task_name"
    t.string "timesheet_cell_project_title"
    t.date "timesheet_cell_work_date"
    t.float "timesheet_cell_hours"
    t.string "timesheet_cell_comments"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["weekly_status_id"], name: "index_weekly_status_details_on_weekly_status_id"
  end

  create_table "weekly_statuses", force: :cascade do |t|
    t.string "user_email"
    t.date "week_start_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_email", "week_start_date"], name: "idx_weekly_statuses", unique: true
  end

  create_table "weekly_summaries", force: :cascade do |t|
    t.bigint "weekly_status_id"
    t.string "person_last_name"
    t.string "person_first_name"
    t.string "person_email_id"
    t.string "person_timesheet_approval_group_name"
    t.string "person_default_pay_code"
    t.string "timesheet_cell_project_code"
    t.string "timesheet_cell_task_name"
    t.string "timesheet_cell_project_title"
    t.float "total_hours"
    t.string "weekly_summary_comment"
    t.string "blockers"
    t.string "next_planned_activity"
    t.boolean "reviewed", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["weekly_status_id"], name: "index_weekly_summaries_on_weekly_status_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
end
