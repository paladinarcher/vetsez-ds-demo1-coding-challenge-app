Comment.destroy_all
Comment.create([{comment: "Test Comment 2 #{Time.now}"},{comment: "Test Comment 1 #{Time.now}"}])