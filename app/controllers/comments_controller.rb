class CommentsController < ApplicationController
  # before_action :set_comment, only: [:show, :edit, :update, :destroy]
 $log.always("I have loaded the comments controller")
  def root
  end

  def fetch_time
    render json: {time: Time.now.to_s}
  end

  def add_comment
    $log.always("Comment attempt")
    begin
      c = Comment.new()
      c.comment = params[:comment]
      begin
        c.save!
        $log.info("Comment  #{c.comment} saved to the database!")
        render :json => {success: true, comment: c}
      rescue => ex
        $log.error(LEX("comment save #{c.comment} failed", ex))
        render :json => {success: false}
      end
    rescue => ex
      $log.error("Error in Comment code")
      $log.error(LEX("The error", ex))
    end
    # pull the comment out of the request

  end

  def list_comments
    comments = Comment.all.order(created_at: :desc).limit(5).as_json
    render json: comments
  end
end
