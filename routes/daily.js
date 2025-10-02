const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const Quest = require('../models/Quest');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   GET /api/daily/quest
// @desc    Get today's daily quest
// @access  Public
router.get('/quest', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find quests created today
    const dailyQuest = await Quest.findOne({
      isDailyQuest: true,
      created_at: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('createdBy', 'username role');
    
    if (!dailyQuest) {
      return res.json({ 
        quest: null, 
        message: 'No daily quest available today' 
      });
    }
    
    res.json({ quest: dailyQuest });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/daily/challenge
// @desc    Get today's community challenge
// @access  Public
router.get('/challenge', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find posts created today with community challenge category
    const dailyChallenge = await Post.findOne({
      category: 'Community Challenge',
      isDailyChallenge: true,
      created_at: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('author', 'username role');
    
    if (!dailyChallenge) {
      return res.json({ 
        challenge: null, 
        message: 'No community challenge available today' 
      });
    }
    
    res.json({ challenge: dailyChallenge });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/daily/quest
// @desc    Create today's daily quest (Admin/Partner only)
// @access  Private
router.post('/quest', [auth, roleCheck('partner', 'admin')], async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      difficulty,
      points,
      duration,
      location,
      objectives,
      submissionRequirements,
      maxParticipants
    } = req.body;

    // Check if daily quest already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingDailyQuest = await Quest.findOne({
      isDailyQuest: true,
      created_at: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingDailyQuest) {
      return res.status(400).json({ 
        msg: 'Daily quest already exists for today. Please update the existing one instead.' 
      });
    }

    const newQuest = new Quest({
      title,
      description,
      category,
      difficulty,
      points,
      duration: duration || '1 day',
      location: location || 'HAU Campus',
      objectives,
      submissionRequirements,
      maxParticipants: maxParticipants || 100,
      createdBy: req.user.id,
      isActive: true,
      isDailyQuest: true
    });

    const quest = await newQuest.save();
    res.json(quest);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/daily/challenge
// @desc    Create today's community challenge (Admin/Partner only)
// @access  Private
router.post('/challenge', [auth, roleCheck('partner', 'admin')], async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    // Check if daily challenge already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingDailyChallenge = await Post.findOne({
      category: 'Community Challenge',
      isDailyChallenge: true,
      created_at: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingDailyChallenge) {
      return res.status(400).json({ 
        msg: 'Daily community challenge already exists for today. Please update the existing one instead.' 
      });
    }

    const newChallenge = new Post({
      title,
      content,
      category: 'Community Challenge',
      author: req.user.id,
      tags: tags || [],
      isDailyChallenge: true
    });

    const challenge = await newChallenge.save();
    
    const populatedChallenge = await Post.findById(challenge._id)
      .populate('author', 'username role');
    
    res.json(populatedChallenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/daily/quest/:id
// @desc    Update today's daily quest (Admin/Partner only)
// @access  Private
router.put('/quest/:id', [auth, roleCheck('partner', 'admin')], async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({ msg: 'Quest not found' });
    }

    if (!quest.isDailyQuest) {
      return res.status(400).json({ msg: 'This is not a daily quest' });
    }

    const {
      title,
      description,
      category,
      difficulty,
      points,
      duration,
      location,
      objectives,
      submissionRequirements,
      maxParticipants
    } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;
    if (difficulty) updateData.difficulty = difficulty;
    if (points) updateData.points = points;
    if (duration) updateData.duration = duration;
    if (location) updateData.location = location;
    if (objectives) updateData.objectives = objectives;
    if (submissionRequirements) updateData.submissionRequirements = submissionRequirements;
    if (maxParticipants) updateData.maxParticipants = maxParticipants;

    const updatedQuest = await Quest.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('createdBy', 'username role');

    res.json(updatedQuest);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/daily/challenge/:id
// @desc    Update today's community challenge (Admin/Partner only)
// @access  Private
router.put('/challenge/:id', [auth, roleCheck('partner', 'admin')], async (req, res) => {
  try {
    const challenge = await Post.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    if (!challenge.isDailyChallenge) {
      return res.status(400).json({ msg: 'This is not a daily challenge' });
    }

    const { title, content, tags } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (tags) updateData.tags = tags;

    const updatedChallenge = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('author', 'username role');

    res.json(updatedChallenge);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
