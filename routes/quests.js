const express = require('express');
const router = express.Router();
const Quest = require('../models/Quest');
const QuestSubmission = require('../models/QuestSubmission');
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `quest-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed!'));
    }
  }
});

// @route   GET /api/quests
// @desc    Get all active quests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let filter = { isActive: true };
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    
    const quests = await Quest.find(filter)
      .populate('createdBy', 'username email')
      .sort({ created_at: -1 });
    
    res.json(quests);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/quests/:id
// @desc    Get quest by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id)
      .populate('createdBy', 'username email role');
    
    if (!quest) {
      return res.status(404).json({ msg: 'Quest not found' });
    }
    
    res.json(quest);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Quest not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/quests
// @desc    Create a new quest
// @access  Private (Partner/Admin only)
router.post('/', [auth, checkRole('partner', 'admin'), upload.single('image')], async (req, res) => {
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

    const newQuest = new Quest({
      title,
      description,
      category,
      difficulty,
      points,
      duration,
      location: location || 'HAU Campus',
      objectives,
      submissionRequirements,
      maxParticipants: maxParticipants || 100,
      createdBy: req.user.id,
      isActive: true,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    const quest = await newQuest.save();
    res.json(quest);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/quests/:id
// @desc    Update a quest
// @access  Private (Partner/Admin only)
router.put('/:id', [auth, checkRole('partner', 'admin')], async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({ msg: 'Quest not found' });
    }

    // Check if user is the creator or an admin
    const user = await User.findById(req.user.id);
    if (quest.createdBy.toString() !== req.user.id && user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized to update this quest' });
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
      maxParticipants,
      isActive
    } = req.body;

    // Update fields
    if (title) quest.title = title;
    if (description) quest.description = description;
    if (category) quest.category = category;
    if (difficulty) quest.difficulty = difficulty;
    if (points) quest.points = points;
    if (duration) quest.duration = duration;
    if (location) quest.location = location;
    if (objectives) quest.objectives = objectives;
    if (submissionRequirements) quest.submissionRequirements = submissionRequirements;
    if (maxParticipants) quest.maxParticipants = maxParticipants;
    if (typeof isActive !== 'undefined') quest.isActive = isActive;

    await quest.save();
    res.json(quest);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/quests/:id
// @desc    Delete a quest
// @access  Private (Admin only)
router.delete('/:id', [auth, checkRole('admin')], async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({ msg: 'Quest not found' });
    }

    await Quest.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Quest deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/quests/:id/submit
// @desc    Submit a quest completion
// @access  Private (User)
router.post('/:id/submit', [auth, upload.single('photo')], async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);
    
    if (!quest) {
      return res.status(404).json({ msg: 'Quest not found' });
    }

    const { reflection_text } = req.body;
    
    // Check if user already submitted this quest
    const existingSubmission = await QuestSubmission.findOne({
      user_id: req.user.id,
      quest_id: req.params.id
    });

    if (existingSubmission) {
      return res.status(400).json({ msg: 'You have already submitted this quest' });
    }

    // Get user to check role
    const user = await User.findById(req.user.id);
    
    // Auto-approve if user is admin
    const isAdmin = user.role === 'admin';
    const submission = new QuestSubmission({
      user_id: req.user.id,
      quest_id: req.params.id,
      photo_url: req.file ? req.file.path : '',
      reflection_text: reflection_text || '',
      status: isAdmin ? 'approved' : 'pending',
      reviewed_by: isAdmin ? req.user.id : null,
      reviewed_at: isAdmin ? Date.now() : null
    });

    await submission.save();
    console.log(`Quest submission created: User ${user.username} submitted quest ${quest.title} with status: ${submission.status}`);

    // If admin, immediately award points
    if (isAdmin) {
      // Ensure we're adding to existing points, not replacing
      const currentPoints = user.points || 0;
      const currentEcoScore = user.eco_score || 0;
      
      user.points = currentPoints + quest.points;
      user.eco_score = currentEcoScore + quest.points;
      
      console.log(`Admin auto-approval: Adding ${quest.points} points to ${user.username}. Previous: ${currentPoints}, New: ${user.points}`);
      
      if (!user.questsCompleted.includes(quest._id)) {
        user.questsCompleted.push(quest._id);
      }
      
      await user.save();

      // Update quest completions (check for duplicates)
      const alreadyCompleted = quest.completions.some(c => c.user.toString() === user._id.toString());
      if (!alreadyCompleted) {
        quest.completions.push({
          user: user._id,
          proof: submission.photo_url
        });
        await quest.save();
      }
    }
    
    res.json({ 
      msg: isAdmin ? 'Quest submitted and auto-approved' : 'Quest submitted successfully', 
      submission 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/quests/submissions/my
// @desc    Get user's submissions
// @access  Private
router.get('/submissions/my', auth, async (req, res) => {
  try {
    const submissions = await QuestSubmission.find({ user_id: req.user.id })
      .populate('quest_id', 'title points category')
      .sort({ submitted_at: -1 });
    
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/quests/submissions/all
// @desc    Get all submissions (for admin dashboard)
// @access  Private (Admin only)
router.get('/submissions/all', [auth, checkRole('admin')], async (req, res) => {
  try {
    const submissions = await QuestSubmission.find({})
      .populate('user_id', 'username email role')
      .populate('quest_id', 'title points category')
      .populate('reviewed_by', 'username')
      .sort({ submitted_at: -1 });
    
    console.log(`Found ${submissions.length} total submissions for admin dashboard`);
    res.json(submissions);
  } catch (err) {
    console.error('Error fetching all submissions:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET /api/quests/submissions/pending
// @desc    Get all pending submissions
// @access  Private (Admin only)
router.get('/submissions/pending', [auth, checkRole('admin')], async (req, res) => {
  try {
    const submissions = await QuestSubmission.find({ status: 'pending' })
      .populate('user_id', 'username email')
      .populate('quest_id', 'title points')
      .sort({ submitted_at: -1 });
    
    res.json(submissions);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/quests/submissions/:id/review
// @desc    Approve or reject a submission
// @access  Private (Admin only - Partners cannot review)
router.put('/submissions/:id/review', [auth, checkRole('admin')], async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const submission = await QuestSubmission.findById(req.params.id)
      .populate('user_id')
      .populate('quest_id');
    
    if (!submission) {
      return res.status(404).json({ msg: 'Submission not found' });
    }

    // Prevent re-approving already approved submissions
    if (submission.status === 'approved' && status === 'approved') {
      return res.status(400).json({ msg: 'Submission already approved' });
    }

    const previousStatus = submission.status;
    submission.status = status;
    submission.reviewed_by = req.user.id;
    submission.reviewed_at = Date.now();
    
    if (status === 'rejected' && rejection_reason) {
      submission.rejection_reason = rejection_reason;
    }

    await submission.save();

    // If approved, award points to user (only if not previously approved)
    if (status === 'approved' && previousStatus !== 'approved') {
      const user = submission.user_id;
      const quest = submission.quest_id;
      
      if (!user || !quest) {
        return res.status(404).json({ msg: 'User or Quest not found' });
      }

      // Add points to existing points
      const currentPoints = user.points || 0;
      const currentEcoScore = user.eco_score || 0;
      
      user.points = currentPoints + quest.points;
      user.eco_score = currentEcoScore + quest.points;
      
      console.log(`Adding ${quest.points} points to user ${user.username}. Previous: ${currentPoints}, New: ${user.points}`);
      
      if (!user.questsCompleted.includes(quest._id)) {
        user.questsCompleted.push(quest._id);
      }
      
      await user.save();

      // Update quest completions (check for duplicates)
      const alreadyCompleted = quest.completions.some(c => c.user.toString() === user._id.toString());
      if (!alreadyCompleted) {
        quest.completions.push({
          user: user._id,
          proof: submission.photo_url
        });
        await quest.save();
      }
    }

    res.json({ msg: `Submission ${status}`, submission });
  } catch (err) {
    console.error('Error in review endpoint:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;

