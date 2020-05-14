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

ActiveRecord::Schema.define(version: 2020_05_04_193650) do

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

  create_table "weekly_status_details", force: :cascade do |t|
    t.string "project_code"
    t.string "project_title"
    t.integer "task_number"
    t.string "task"
    t.string "project_type"
    t.string "person"
    t.string "email"
    t.date "task_date"
    t.string "comments"
    t.float "hours"
    t.bigint "weekly_status_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["weekly_status_id"], name: "index_weekly_status_details_on_weekly_status_id"
  end

  create_table "weekly_statuses", force: :cascade do |t|
    t.bigint "user_id"
    t.date "week_start_date"
    t.boolean "active", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_weekly_statuses_on_user_id"
  end

  create_table "weekly_summaries", force: :cascade do |t|
    t.bigint "weekly_status_id"
    t.string "project_code"
    t.string "project_title"
    t.string "task_number"
    t.string "task"
    t.string "project_type"
    t.string "person"
    t.string "email"
    t.float "total_hours"
    t.string "weekly_summary_comment"
    t.string "blockers"
    t.string "next_planned_activity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["weekly_status_id"], name: "index_weekly_summaries_on_weekly_status_id"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
end
