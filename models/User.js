//Josh Andrei Aguiluz
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'partner', 'admin'],
    default: 'user'
  },
  requested_role: {
    type: String,
    enum: ['user', 'partner', 'admin'],
    default: null
  },
  eco_score: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  department: {
    type: String,
    enum: ['SOC', 'SAS', 'SEA', 'SBA', 'SED', 'CCJEF', 'SHTM', 'SNAMS'],
    default: 'SOC'
  },
  avatar_theme: {
    type: String,
    default: 'Girl Avatar 1'
  },
  header_theme: {
    type: String,
    default: 'orange'
  },
  is_approved: {
    type: Boolean,
    default: true  // Default to true, but explicitly set to false for partner/admin requests in signup route
  },
  is_original_admin: {
    type: Boolean,
    default: false  // Only the original admin@hau.edu.ph should have this set to true
  },
  questsCompleted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest'
  }],
  challengesCompleted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  badges: [{
    name: String,
    description: String,
    image_url: String,
    challenge_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  achievements: [{
    title: String,
    description: String,
    category: String,
    progress: {
      current: Number,
      target: Number
    },
    isCompleted: {
      type: Boolean,
      default: false
    },
    earnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);