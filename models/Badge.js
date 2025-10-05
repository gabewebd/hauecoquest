const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  image_url: { type: String },
  criteria: {
    type: { 
      type: String, 
      enum: [
        'points', 
        'quests_completed', 
        'special', 
        'first_quest',
        'energy_conservation',
        'water_saved',
        'challenge_joined'
      ], 
      required: true 
    },
    value: { type: Number, required: true }
  }
});

module.exports = mongoose.model('Badge', BadgeSchema);

