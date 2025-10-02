const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const User = require('../models/User');

// @route   GET /api/badges/user/:userId
// @desc    Get badges for a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user_id: req.params.userId })
      .populate('badge_id', 'name description image_url criteria')
      .sort({ earned_at: -1 });
    
    res.json(userBadges);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/badges/my
// @desc    Get current user's badges
// @access  Private
router.get('/my', auth, async (req, res) => {
  try {
    const userBadges = await UserBadge.find({ user_id: req.user.id })
      .populate('badge_id', 'name description image_url criteria')
      .sort({ earned_at: -1 });
    
    res.json(userBadges);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/badges/available
// @desc    Get all available badges
// @access  Public
router.get('/available', async (req, res) => {
  try {
    const badges = await Badge.find({}).sort({ name: 1 });
    res.json(badges);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
