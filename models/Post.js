const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Environmental Tips', 'Success Stories', 'Updates', 'Events', 'News', 'Community Challenge'], 
    default: 'Updates' 
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image_url: { type: String },
  tags: [{ type: String }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  }],
  views: { type: Number, default: 0 },
  isDailyChallenge: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);

