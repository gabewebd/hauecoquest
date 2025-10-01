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
    unique: true, // No two users can have the same email
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  // You can add more fields here to save what users do, like points, quests completed, etc.
  points: {
    type: Number,
    default: 0
  },
  questsCompleted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quest' // We can create a 'Quest' model later
  }]
});

// IMPORTANT: This part runs BEFORE a user is saved to the database.
// It "hashes" the password so you never store plain-text passwords. This is essential for security!
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// This adds a helper method to our user model to compare passwords during login
userSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);