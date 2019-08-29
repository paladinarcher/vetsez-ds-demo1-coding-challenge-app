require "application_system_test_case"

class CardModelsTest < ApplicationSystemTestCase
  setup do
    @card_model = card_models(:one)
  end

  test "visiting the index" do
    visit card_models_url
    assert_selector "h1", text: "Card Models"
  end

  test "creating a Card model" do
    visit card_models_url
    click_on "New Card Model"

    fill_in "Appointment date", with: @card_model.appointment_date
    fill_in "Branch", with: @card_model.branch
    fill_in "Email", with: @card_model.email
    fill_in "First name", with: @card_model.first_name
    fill_in "Last name", with: @card_model.last_name
    fill_in "Selection", with: @card_model.selection
    fill_in "Comment", with: @card_model.comment
    click_on "Create Card model"

    assert_text "Card model was successfully created"
    click_on "Back"
  end

  test "updating a Card model" do
    visit card_models_url
    click_on "Edit", match: :first

    fill_in "Appointment date", with: @card_model.appointment_date
    fill_in "Branch", with: @card_model.branch
    fill_in "Email", with: @card_model.email
    fill_in "First name", with: @card_model.first_name
    fill_in "Last name", with: @card_model.last_name
    fill_in "Selection", with: @card_model.selection
    fill_in "Comment", with: @card_model.comment
    click_on "Update Card model"

    assert_text "Card model was successfully updated"
    click_on "Back"
  end

  test "destroying a Card model" do
    visit card_models_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Card model was successfully destroyed"
  end
end
