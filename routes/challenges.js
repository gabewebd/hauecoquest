const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const ChallengeSubmission = require('../models/ChallengeSubmission');
const User = require('../models/User');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `challenge-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'));
        }
    }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ msg: 'File too large. Maximum size is 5MB.' });
        }
    } else if (err.message === 'Only images are allowed!') {
        return res.status(400).json({ msg: 'Only images are allowed!' });
    }
    next(err);
};

// @route   GET /api/challenges
// @desc    Get all active challenges
// @access  Public
router.get('/', async (req, res) => {
    try {
        const challenges = await Challenge.find({ isActive: true })
            .populate('participants.user', 'username')
            .sort({ created_at: -1 });
        
        res.json(challenges);
    } catch (err) {
        console.error('Error fetching challenges:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/challenges/:id
// @desc    Get single challenge by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id)
            .populate('participants.user', 'username email avatar_theme');
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }
        
        res.json(challenge);
    } catch (err) {
        console.error('Error fetching challenge:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Challenge not found' });
        }
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /api/challenges
// @desc    Create a new challenge (Admin/Partner only)
// @access  Private
router.post('/', [auth, roleCheck('admin', 'partner')], async (req, res) => {
    try {
        const {
            title,
            description,
            goal,
            category,
            badgeReward,
            endDate,
            imageUrl
        } = req.body;

        const newChallenge = new Challenge({
            title,
            description,
            goal: goal || 1000,
            category: category || 'Environmental',
            badgeReward: badgeReward || 'Tree Master',
            endDate,
            imageUrl,
            currentProgress: 0
        });

        const challenge = await newChallenge.save();
        console.log(`Challenge created: ${challenge.title} with goal ${challenge.goal}`);
        res.json(challenge);
    } catch (err) {
        console.error('Error creating challenge:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /api/challenges/:id/join
// @desc    Join a challenge with photo proof (Users only - not admin/partner)
// @access  Private
router.post('/:id/join', [auth, upload.single('photo'), handleUploadError], async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        const user = await User.findById(req.user.id);

        // Admins and partners can't join challenges
        if (user.role === 'admin' || user.role === 'partner') {
            return res.status(403).json({ msg: 'Admins and partners can only view challenges, not participate' });
        }

        // Check if user already joined
        const alreadyJoined = challenge.participants.some(
            p => p.user.toString() === req.user.id
        );

        if (alreadyJoined) {
            return res.status(400).json({ msg: 'You have already joined this challenge' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload a photo as proof' });
        }

        const { contribution } = req.body;
        const contributionAmount = contribution || 1;

        // Add user to participants with pending status
        challenge.participants.push({
            user: req.user.id,
            contribution: contributionAmount,
            photo_url: `/uploads/${req.file.filename}`,
            status: 'pending'
        });

        await challenge.save();

        console.log(`User ${user.username} submitted to join challenge: ${challenge.title}. Awaiting approval.`);

        res.json({ 
            msg: 'Challenge submission sent for approval!', 
            challenge
        });
    } catch (err) {
        console.error('Error joining challenge:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/challenges/:id/submissions/pending
// @desc    Get pending challenge submissions (Admin only)
// @access  Private
router.get('/:id/submissions/pending', [auth, roleCheck('admin')], async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id)
            .populate('participants.user', 'username email role');
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        const pendingParticipants = challenge.participants.filter(p => p.status === 'pending');
        
        res.json(pendingParticipants);
    } catch (err) {
        console.error('Error fetching pending submissions:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT /api/challenges/:id/submissions/:participantId/review
// @desc    Approve or reject a challenge submission (Admin only)
// @access  Private
router.put('/:id/submissions/:participantId/review', [auth, roleCheck('admin')], async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        const participant = challenge.participants.id(req.params.participantId);
        
        if (!participant) {
            return res.status(404).json({ msg: 'Participant not found' });
        }

        if (participant.status === 'approved') {
            return res.status(400).json({ msg: 'This submission is already approved' });
        }

        participant.status = status;
        participant.reviewed_by = req.user.id;
        participant.reviewed_at = Date.now();

        // If approved, update progress and award badge
        if (status === 'approved') {
            challenge.currentProgress += participant.contribution;

            // Award "Tree Master" badge
            const treeMasterBadge = await Badge.findOne({ name: 'Tree Master' });
            
            if (treeMasterBadge) {
                const existingUserBadge = await UserBadge.findOne({
                    user_id: participant.user,
                    badge_id: treeMasterBadge._id
                });

                if (!existingUserBadge) {
                    const userBadge = new UserBadge({
                        user_id: participant.user,
                        badge_id: treeMasterBadge._id
                    });
                    await userBadge.save();
                    console.log(`Tree Master badge awarded to user`);
                }
            }
        }

        await challenge.save();

        console.log(`Challenge submission ${status}. Progress: ${challenge.currentProgress}/${challenge.goal}`);

        res.json({ 
            msg: `Submission ${status}`, 
            challenge 
        });
    } catch (err) {
        console.error('Error reviewing submission:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/challenges/:id/participants
// @desc    Get all participants of a challenge
// @access  Public
router.get('/:id/participants', async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id)
            .populate('participants.user', 'username email avatar_theme points');
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }
        
        res.json(challenge.participants);
    } catch (err) {
        console.error('Error fetching participants:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT /api/challenges/:id
// @desc    Update a challenge (Admin only)
// @access  Private
router.put('/:id', [auth, roleCheck('admin')], async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        const {
            title,
            description,
            goal,
            currentProgress,
            isActive,
            endDate
        } = req.body;

        if (title) challenge.title = title;
        if (description) challenge.description = description;
        if (goal) challenge.goal = goal;
        if (typeof currentProgress !== 'undefined') challenge.currentProgress = currentProgress;
        if (typeof isActive !== 'undefined') challenge.isActive = isActive;
        if (endDate) challenge.endDate = endDate;

        await challenge.save();
        res.json(challenge);
    } catch (err) {
        console.error('Error updating challenge:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /api/challenges/submit
// @desc    Submit challenge proof (Users only)
// @access  Private
router.post('/submit', [auth, upload.single('photo'), handleUploadError], async (req, res) => {
    try {
        const { reflection, challengeId } = req.body;
        
        if (!reflection || !challengeId) {
            return res.status(400).json({ msg: 'Reflection and challenge ID are required' });
        }

        if (!req.file) {
            return res.status(400).json({ msg: 'Photo proof is required' });
        }

        const challenge = await Challenge.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        // Check if user already submitted to this challenge
        const existingSubmission = await ChallengeSubmission.findOne({
            challenge_id: challengeId,
            user_id: req.user.id
        });

        if (existingSubmission) {
            return res.status(400).json({ msg: 'You have already submitted to this challenge' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'challenge-submissions',
            resource_type: 'auto'
        });

        // Create challenge submission
        const submission = new ChallengeSubmission({
            challenge_id: challengeId,
            user_id: req.user.id,
            reflection_text: reflection,
            photo_url: result.secure_url,
            status: 'pending'
        });

        await submission.save();

        // Clean up local file
        fs.unlinkSync(req.file.path);

        res.json({ 
            msg: 'Challenge submission sent for approval!', 
            submission 
        });
    } catch (err) {
        console.error('Error submitting challenge:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/challenges/submissions/all
// @desc    Get all challenge submissions (Admin only)
// @access  Private
router.get('/submissions/all', [auth, roleCheck('admin')], async (req, res) => {
    try {
        const submissions = await ChallengeSubmission.find()
            .populate('user_id', 'username email avatar_theme role')
            .populate('challenge_id', 'title points')
            .sort({ submitted_at: -1 });
        
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching challenge submissions:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/challenges/submissions/user/:userId
// @desc    Get challenge submissions for a specific user
// @access  Private
router.get('/submissions/user/:userId', auth, async (req, res) => {
    try {
        const submissions = await ChallengeSubmission.find({ user_id: req.params.userId })
            .populate('challenge_id', 'title points category')
            .sort({ submitted_at: -1 });
        
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching user challenge submissions:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/challenges/:id/submissions
// @desc    Get all submissions for a challenge (Admin only)
// @access  Private
router.get('/:id/submissions', [auth, roleCheck('admin')], async (req, res) => {
    try {
        const submissions = await ChallengeSubmission.find({ challenge_id: req.params.id })
            .populate('user_id', 'username email avatar_theme')
            .sort({ submitted_at: -1 });
        
        res.json(submissions);
    } catch (err) {
        console.error('Error fetching challenge submissions:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT /api/challenges/submissions/:id/review
// @desc    Approve or reject a challenge submission (Admin only)
// @access  Private
router.put('/submissions/:id/review', [auth, roleCheck('admin')], async (req, res) => {
    try {
        const { status, rejection_reason } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ msg: 'Invalid status' });
        }

        const submission = await ChallengeSubmission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ msg: 'Submission not found' });
        }

        submission.status = status;
        submission.reviewed_by = req.user.id;
        submission.reviewed_at = new Date();
        
        if (status === 'rejected' && rejection_reason) {
            submission.rejection_reason = rejection_reason;
        }

        await submission.save();

        // If approved, award badge and update user points
        if (status === 'approved') {
            const user = await User.findById(submission.user_id);
            if (user) {
                user.eco_score += 50; // Award points for challenge completion
                await user.save();

                // Award "Tree Master" badge
                const treeMasterBadge = await Badge.findOne({ name: 'Tree Master' });
                if (treeMasterBadge) {
                    const existingUserBadge = await UserBadge.findOne({
                        user_id: submission.user_id,
                        badge_id: treeMasterBadge._id
                    });

                    if (!existingUserBadge) {
                        const userBadge = new UserBadge({
                            user_id: submission.user_id,
                            badge_id: treeMasterBadge._id
                        });
                        await userBadge.save();
                    }
                }
            }
        }

        res.json({ 
            msg: `Submission ${status}`, 
            submission 
        });
    } catch (err) {
        console.error('Error reviewing submission:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   DELETE /api/challenges/:id
// @desc    Delete a challenge (Admin only)
// @access  Private
router.delete('/:id', [auth, roleCheck('admin')], async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        await Challenge.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Challenge deleted' });
    } catch (err) {
        console.error('Error deleting challenge:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

