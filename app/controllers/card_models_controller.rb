class CardModelsController < ApplicationController
  before_action :set_card_model, only: [:show, :edit, :update, :destroy]

  # GET /card_models
  # GET /card_models.json
  def index
    @card_models = CardModel.all
  end

  # GET /card_models/1
  # GET /card_models/1.json
  def show
  end

  # GET /card_models/new
  def new
    @card_model = CardModel.new
  end

  # GET /card_models/1/edit
  def edit
  end

  # POST /card_models
  # POST /card_models.json
  def create
    @card_model = CardModel.new(card_model_params)

    respond_to do |format|
      if @card_model.save
        format.html { redirect_to @card_model, notice: 'Card model was successfully created.' }
        format.json { render :show, status: :created, location: @card_model }
      else
        format.html { render :new }
        format.json { render json: @card_model.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /card_models
  # POST /card_models.json
  def ajax_post_form
    $log.always(params.inspect)
    card_model = CardModel.new
    card_model.first_name = params[:first_name]
    card_model.last_name = params[:last_name]
    card_model.email = params[:email]
    card_model.appointment_date= params[:appointment_date]
    card_model.comment= params[:comment]
    card_model.branch= params[:branch]
    card_model.selection= params[:selection]
    $log.always(card_model.inspect)

    if card_model.save
      $log.always("-------------------Success-------------------------")
      render json: {success: true, message: "Form saved successfully! Model id is #{card_model.id}"}
    else
      $log.always("-------------------Error-------------------------")
      $log.always(card_model.errors.inspect)

      render json: {success: false, message: card_model.errors}, status: :bad_request
    end
  end

  # PATCH/PUT /card_models/1
  # PATCH/PUT /card_models/1.json
  def update
    respond_to do |format|
      if @card_model.update(card_model_params)
        format.html { redirect_to @card_model, notice: 'Card model was successfully updated.' }
        format.json { render :show, status: :ok, location: @card_model }
      else
        format.html { render :edit }
        format.json { render json: @card_model.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /card_models/1
  # DELETE /card_models/1.json
  def destroy
    @card_model.destroy
    respond_to do |format|
      format.html { redirect_to card_models_url, notice: 'Card model was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_card_model
      @card_model = CardModel.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def card_model_params
      params.permit(:first_name, :last_name, :email, :branch, :appointment_date, :selection, :comment)
    end
end
