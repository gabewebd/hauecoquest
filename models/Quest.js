const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Recycling & Waste', 'Energy Conservation', 'Water Conservation', 'Gardening & Planting', 'Transportation', 'Education & Awareness'],
    required: true 
  },
  difficulty: { 
    type: String, 
    enum: ['Easy', 'Medium', 'Hard'], 
    default: 'Medium' 
  },
  points: { type: Number, required: true },
  duration: { type: String, default: '1 week' },
  location: { type: String, default: 'HAU Campus' },
  objectives: [{ type: String }],
  submissionRequirements: [{ type: String }],
  maxParticipants: { type: Number, default: 100 },
  completions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    proof: { type: String },
    completedAt: { type: Date, default: Date.now }
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: true },
  imageUrl: { type: String },
  isDailyQuest: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quest', QuestSchema);

