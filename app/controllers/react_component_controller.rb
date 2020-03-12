class ReactComponentController < ApplicationController
  before_action :authenticate_user!, except: [:no_auth, :fetch_time, :only_approved_users]
  before_action :only_approved_users, only: [:auth] #keep after authenticate_user! above.

  #hit on account
  def auth
  end

  def no_auth
  end

  def awaiting_approval
    redirect_to account_path if (current_user.approved)
  end

  def fetch_time
    render json: {current_time: Time.now}
  end

  private

  def only_approved_users
    if (current_user.approved)
      if (!request.path.to_s.eql?(account_path.to_s))
        redirect_to account_path
      end
    else
      redirect_to awaiting_approval_path
    end
  end
end
