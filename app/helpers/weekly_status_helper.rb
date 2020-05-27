module WeeklyStatusHelper
  NOT_STARTED = {status: 'Not Started', image: 'bolt', color: 'red'} # not yet looked at - no rows in summary
  IN_PROCESS = {status: 'In Process', image: 'edit', color: 'green'} # some but not all summaries have been reviewed
  COMPLETED = {status: 'Completed', image: 'check', color: 'black'} # all summaries are reviewed

  def fetch_summary_status(weekly_status)
    if weekly_status.not_started?
      return NOT_STARTED
    elsif weekly_status.in_process?
      return IN_PROCESS
    end
    COMPLETED
  end
end

