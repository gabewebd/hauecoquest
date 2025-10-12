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
    const { username, avatar_theme, header_theme } = req.body;

    const user = await User.findById(req.user.id);

    if (username) user.username = username;
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

    if (department && department !== 'all') {
      // Department-specific leaderboard - only show regular users (exclude admin and partner roles)
      const users = await User.find({ department, role: 'user' })
        .select('username eco_score points questsCompleted avatar_theme role department')
        .sort({ eco_score: -1 })
        .limit(100);

      // Calculate department total points
      const departmentTotal = users.reduce((sum, user) => sum + (user.eco_score || user.points || 0), 0);

      const leaderboard = users.map((user, index) => ({
        _id: user._id,
        rank: index + 1,
        username: user.username,
        eco_score: user.eco_score,
        points: user.points,
        questsCompleted: user.questsCompleted.length,
        avatar_theme: user.avatar_theme,
        role: user.role,
        department: user.department,
        departmentTotal: departmentTotal
      }));

      res.json({
        leaderboard,
        departmentTotal,
        department,
        totalUsers: users.length
      });
    } else {
      // All departments leaderboard - show department totals (only regular users, exclude admin and partner roles)
      const allUsers = await User.find({ role: 'user' })
        .select('username eco_score points questsCompleted avatar_theme role department')
        .sort({ eco_score: -1 })
        .limit(100);

      // Group by department and calculate totals
      const departmentTotals = {};
      allUsers.forEach(user => {
        const dept = user.department || 'SOC'; // Default to SOC if no department
        if (!departmentTotals[dept]) {
          departmentTotals[dept] = {
            department: dept,
            totalPoints: 0,
            userCount: 0,
            topUsers: []
          };
        }
        departmentTotals[dept].totalPoints += (user.eco_score || user.points || 0);
        departmentTotals[dept].userCount += 1;

        // Keep top 3 users per department
        if (departmentTotals[dept].topUsers.length < 3) {
          departmentTotals[dept].topUsers.push({
            _id: user._id,
            username: user.username,
            points: user.eco_score || user.points || 0,
            avatar_theme: user.avatar_theme
          });
        }
      });

      // Convert to array and sort by total points
      const departmentLeaderboard = Object.values(departmentTotals)
        .sort((a, b) => b.totalPoints - a.totalPoints)
        .map((dept, index) => ({
          rank: index + 1,
          department: dept.department,
          totalPoints: dept.totalPoints,
          userCount: dept.userCount,
          topUsers: dept.topUsers
        }));

      res.json({
        leaderboard: departmentLeaderboard,
        type: 'department'
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('questsCompleted', 'title points category');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
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
      .populate('questsCompleted', 'title points category')
      .populate('challengesCompleted', 'title points badgeTitle')
      .populate('badges', 'name description image_url')
      .populate('achievements');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const stats = {
      username: user.username,
      eco_score: user.eco_score,
      points: user.points,
      questsCompleted: user.questsCompleted.length,
      challengesCompleted: user.challengesCompleted.length,
      badges: user.badges.length,
      achievements: user.achievements.length,
      avatar_theme: user.avatar_theme,
      role: user.role,
      department: user.department,
      completedQuests: user.questsCompleted,
      completedChallenges: user.challengesCompleted,
      userBadges: user.badges,
      userAchievements: user.achievements
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

// @route   GET /api/users/:userId/photos
// @desc    Get specific user's photo history from quest submissions
// @access  Public
router.get('/:userId/photos', async (req, res) => {
  try {
    const QuestSubmission = require('../models/QuestSubmission');

    const submissions = await QuestSubmission.find({
      user_id: req.params.userId,
      photo_url: { $exists: true, $ne: '' }
    })
      .populate('quest_id', 'title category')
      .sort({ submitted_at: -1 });

    const photos = submissions.map(submission => ({
      id: submission._id,
      photo_url: submission.photo_url,
      image_url: submission.photo_url, // Keep both for compatibility
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
      image_url: submission.photo_url, // Keep both for compatibility
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

