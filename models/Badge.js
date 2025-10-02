const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image_url: { type: String },
  criteria: {
    type: { type: String, enum: ['points', 'quests_completed', 'special'], required: true },
    threshold: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Badge', BadgeSchema);

