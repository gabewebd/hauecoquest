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

// @route   GET /api/badges/user/:userId/progress
// @desc    Get user badge progress and next badges to unlock
// @access  Public
router.get('/user/:userId/progress', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get all badges
    const allBadges = await Badge.find();
    
    // Get user's earned badges
    const userBadges = await UserBadge.find({ user_id: req.params.userId })
      .populate('badge_id', 'name description image_url criteria');

    // Calculate progress for each badge
    const badgeProgress = allBadges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badge_id._id.toString() === badge._id.toString());
      const isEarned = !!userBadge;
      
      let progress = 0;
      let current = 0;
      let target = 0;

      // Calculate progress based on badge criteria
      if (badge.criteria.type === 'quests_completed') {
        current = user.questsCompleted.length;
        target = badge.criteria.value;
        progress = Math.min((current / target) * 100, 100);
      } else if (badge.criteria.type === 'energy_conservation') {
        current = user.goals.energy_conservation.current;
        target = badge.criteria.value;
        progress = Math.min((current / target) * 100, 100);
      } else if (badge.criteria.type === 'water_saved') {
        current = user.goals.water_saved.current;
        target = badge.criteria.value;
        progress = Math.min((current / target) * 100, 100);
      }

      return {
        ...badge.toObject(),
        isEarned,
        progress: Math.round(progress),
        current,
        target,
        earnedAt: userBadge ? userBadge.earned_at : null
      };
    });

    // Get next badges to unlock (not earned yet, sorted by progress)
    const nextBadges = badgeProgress
      .filter(badge => !badge.isEarned)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);

    res.json({
      totalBadges: allBadges.length,
      earnedBadges: userBadges.length,
      badgeProgress,
      nextBadges
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/badges/check-and-award
// @desc    Check and award badges for a user
// @access  Private
router.post('/check-and-award', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const allBadges = await Badge.find();
    const userBadges = await UserBadge.find({ user_id: req.user.id });
    const earnedBadgeIds = userBadges.map(ub => ub.badge_id.toString());

    const newBadges = [];

    for (const badge of allBadges) {
      if (earnedBadgeIds.includes(badge._id.toString())) continue;

      let shouldAward = false;

      if (badge.criteria.type === 'first_quest' && user.questsCompleted.length >= 1) {
        shouldAward = true;
      } else if (badge.criteria.type === 'quests_completed' && user.questsCompleted.length >= badge.criteria.value) {
        shouldAward = true;
      } else if (badge.criteria.type === 'energy_conservation' && user.goals.energy_conservation.current >= badge.criteria.value) {
        shouldAward = true;
      } else if (badge.criteria.type === 'water_saved' && user.goals.water_saved.current >= badge.criteria.value) {
        shouldAward = true;
      }

      if (shouldAward) {
        const userBadge = new UserBadge({
          user_id: req.user.id,
          badge_id: badge._id,
          earned_at: new Date()
        });
        await userBadge.save();
        newBadges.push(badge);
      }
    }

    res.json({ newBadges });
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
