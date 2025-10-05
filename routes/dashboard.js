const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Quest = require('../models/Quest');
const QuestSubmission = require('../models/QuestSubmission');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const Challenge = require('../models/Challenge');

// @route   GET /api/dashboard/user
// @desc    Get user dashboard data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user's quest submissions
    const submissions = await QuestSubmission.find({ user_id: req.user.id })
      .populate('quest_id', 'title category points difficulty')
      .sort({ submitted_at: -1 });

    // Get user's badges progress
    const allBadges = await Badge.find();
    const userBadges = await UserBadge.find({ user_id: req.user.id })
      .populate('badge_id', 'name description image_url criteria');

    // Calculate badge progress
    const badgeProgress = allBadges.map(badge => {
      const userBadge = userBadges.find(ub => ub.badge_id._id.toString() === badge._id.toString());
      const isEarned = !!userBadge;
      
      let progress = 0;
      let current = 0;
      let target = 0;

      if (badge.criteria.type === 'first_quest') {
        current = user.questsCompleted.length >= 1 ? 1 : 0;
        target = 1;
        progress = current * 100;
      } else if (badge.criteria.type === 'quests_completed') {
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

    // Get next badges to unlock
    const nextBadges = badgeProgress
      .filter(badge => !badge.isEarned)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);

    // Calculate level and progress
    const totalPoints = user.points || 0;
    const level = Math.floor(totalPoints / 100) + 1;
    const levelProgress = (totalPoints % 100) / 100 * 100;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        eco_score: user.eco_score,
        level,
        levelProgress,
        streaks: user.streaks,
        goals: user.goals,
        avatar_theme: user.avatar_theme,
        header_theme: user.header_theme
      },
      submissions,
      badges: {
        total: allBadges.length,
        earned: userBadges.length,
        progress: badgeProgress,
        nextBadges
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/dashboard/community-challenge
// @desc    Get current community challenge
// @access  Public
router.get('/community-challenge', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ isActive: true })
      .sort({ created_at: -1 });
    
    if (!challenge) {
      return res.json({ challenge: null });
    }

    // Calculate progress
    const progress = challenge.current_progress || 0;
    const target = challenge.target || 1000;
    const percentage = Math.round((progress / target) * 100);

    res.json({
      challenge: {
        ...challenge.toObject(),
        percentage
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/dashboard/join-challenge
// @desc    Join community challenge
// @access  Private
router.post('/join-challenge', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ isActive: true })
      .sort({ created_at: -1 });
    
    if (!challenge) {
      return res.status(404).json({ msg: 'No active challenge found' });
    }

    // Check if user already joined
    if (challenge.participants.includes(req.user.id)) {
      return res.status(400).json({ msg: 'Already joined this challenge' });
    }

    // Add user to participants
    challenge.participants.push(req.user.id);
    await challenge.save();

    res.json({ msg: 'Successfully joined challenge' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;