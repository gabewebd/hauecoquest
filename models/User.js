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
  profile_picture_url: {
    type: String,
    default: ''
  },
  hau_affiliation: {
    type: String,
    default: ''
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
    default: true  // Regular users are auto-approved, only partner/admin requests need approval
  },
  questsCompleted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest'
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);