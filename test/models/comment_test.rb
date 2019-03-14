require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  setup do
    Comment.destroy_all
  end

  teardown do
    Comment.destroy_all
  end

  test "test can create comment" do
    comment = Comment.new
    comment.comment = "Hello World"
    comment.save!

    assert Comment.count == 1
  end

end
