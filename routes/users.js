const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('questsCompleted', 'title points');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { username, hau_affiliation, avatar_theme, header_theme } = req.body;

    const user = await User.findById(req.user.id);

    if (username) user.username = username;
    if (hau_affiliation) user.hau_affiliation = hau_affiliation;
    if (avatar_theme) user.avatar_theme = avatar_theme;
    if (header_theme) user.header_theme = header_theme;

    await user.save();

    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard
// @access  Public
router.get('/leaderboard', async (req, res) => {
  try {
    const { department } = req.query;

    // Build query object
    const query = {};
    if (department && department !== 'all') {
      query.department = department;
    }

    const users = await User.find(query)
      .select('username eco_score points questsCompleted avatar_theme role department')
      .sort({ eco_score: -1 })
      .limit(100);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      eco_score: user.eco_score,
      points: user.points,
      questsCompleted: user.questsCompleted.length,
      avatar_theme: user.avatar_theme,
      role: user.role,
      department: user.department
    }));

    res.json(leaderboard);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/users/:id/stats
// @desc    Get user stats by ID
// @access  Public
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('questsCompleted', 'title points category');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const stats = {
      username: user.username,
      eco_score: user.eco_score,
      points: user.points,
      questsCompleted: user.questsCompleted.length,
      avatar_theme: user.avatar_theme,
      role: user.role,
      completedQuests: user.questsCompleted
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/users/profile
// @desc    Delete current user's account
// @access  Private
router.delete('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await User.findByIdAndDelete(req.user.id);

    res.json({ msg: 'Account deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/users/photos
// @desc    Get user's photo history from quest submissions
// @access  Private
router.get('/photos', auth, async (req, res) => {
  try {
    const QuestSubmission = require('../models/QuestSubmission');

    const submissions = await QuestSubmission.find({
      user_id: req.user.id,
      photo_url: { $exists: true, $ne: '' }
    })
      .populate('quest_id', 'title category')
      .sort({ submitted_at: -1 });

    const photos = submissions.map(submission => ({
      id: submission._id,
      photo_url: submission.photo_url,
      quest_title: submission.quest_id?.title || 'Unknown Quest',
      quest_category: submission.quest_id?.category || 'General',
      submitted_at: submission.submitted_at,
      status: submission.status
    }));

    res.json(photos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

