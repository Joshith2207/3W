const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: [true, 'Comment content cannot be empty']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  text: {
    type: String,
    // Not strictly required if an image is provided
  },
  imageUrl: {
    type: String,
    // Not strictly required if text is provided
  },
  likes: {
    type: [String], // Store usernames of people who liked this post
    default: []
  },
  comments: {
    type: [CommentSchema], // Subdocuments of comments
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that either text or imageUrl is present before saving
PostSchema.pre('validate', function(next) {
  if (!this.text && !this.imageUrl) {
    this.invalidate('text', 'A post must contain either text or an image URL');
    this.invalidate('imageUrl', 'A post must contain either text or an image URL');
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
