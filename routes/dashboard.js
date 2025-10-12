const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Quest = require('../models/Quest');
const QuestSubmission = require('../models/QuestSubmission');
const Challenge = require('../models/Challenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');

// @route   GET /api/dashboard/user
// @desc    Get user dashboard data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('questsCompleted', 'title category points difficulty')
      .populate('challengesCompleted', 'title points badgeTitle badge_url')
      .populate('badges', 'name description image_url')
      .populate('achievements');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get user's quest submissions
    const questSubmissions = await QuestSubmission.find({ user_id: req.user.id })
      .populate('quest_id', 'title category points difficulty')
      .sort({ submitted_at: -1 });

    // Get user's challenge submissions
    const challengeSubmissions = await ChallengeSubmission.find({ user_id: req.user.id })
      .populate('challenge_id', 'title points badgeTitle badge_url')
      .sort({ submitted_at: -1 });

    // Calculate total points from both quests and challenges
    const questPoints = user.questsCompleted.reduce((sum, quest) => sum + (quest.points || 0), 0);
    const challengePoints = user.challengesCompleted.reduce((sum, challenge) => sum + (challenge.points || 0), 0);
    const totalPoints = questPoints + challengePoints;

    // Update user points if they don't match
    if (user.points !== totalPoints) {
      user.points = totalPoints;
      user.eco_score = totalPoints; // Keep eco_score in sync
      await user.save();
    }

    // Calculate level and progress
    const level = Math.floor(totalPoints / 100) + 1;
    const levelProgress = (totalPoints % 100) / 100 * 100;

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: totalPoints,
        eco_score: totalPoints,
        level,
        levelProgress,
        avatar_theme: user.avatar_theme,
        header_theme: user.header_theme,
        department: user.department,
        role: user.role
      },
      questSubmissions,
      challengeSubmissions,
      questsCompleted: user.questsCompleted,
      challengesCompleted: user.challengesCompleted,
      badges: user.badges,
      achievements: user.achievements,
      stats: {
        totalQuests: user.questsCompleted.length,
        totalChallenges: user.challengesCompleted.length,
        totalBadges: user.badges.length,
        totalAchievements: user.achievements.length,
        questPoints,
        challengePoints,
        totalPoints
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