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

        // Calculate approved participants count
        const approvedParticipants = challenge.participants.filter(p => p.status === 'approved').length;
        
        // Add calculated fields to the response
        const challengeWithStats = {
            ...challenge.toObject(),
            approvedParticipants,
            totalParticipants: challenge.participants.length
        };
        
        res.json(challengeWithStats);
    } catch (err) {
        console.error('Error fetching challenge:', err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Challenge not found' });
        }
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

        // Also update the ChallengeSubmission status
        const challengeSubmission = await ChallengeSubmission.findOne({
            challenge_id: req.params.id,
            user_id: participant.user
        });
        
        if (challengeSubmission) {
            challengeSubmission.status = status;
            challengeSubmission.reviewed_by = req.user.id;
            challengeSubmission.reviewed_at = Date.now();
            await challengeSubmission.save();
            console.log(`Updated ChallengeSubmission status to ${status}`);
        }

        // If approved, update progress and award badge
        if (status === 'approved') {
            challenge.currentProgress += participant.contribution;

            // Award points to user
            const user = await User.findById(participant.user);
            if (user) {
                user.points = (user.points || 0) + (challenge.points || 50);
                user.questsCompleted = (user.questsCompleted || 0) + 1;
                await user.save();
                console.log(`Awarded ${challenge.points || 50} points and updated quest count to user ${user.username}`);
            }

            // Award challenge completion badge
            let badgeToAward = null;
            
            // Check if this is a tree planting challenge
            if (challenge.title.toLowerCase().includes('tree') || challenge.title.toLowerCase().includes('plant')) {
                badgeToAward = await Badge.findOne({ name: 'Tree Master' });
                console.log('Looking for Tree Master badge for tree planting challenge');
            } else {
                // Default challenge completion badge
                badgeToAward = await Badge.findOne({ name: 'Community Champion' });
                console.log('Looking for Community Champion badge for general challenge');
            }
            
            console.log('Badge to award:', badgeToAward);
            
            if (badgeToAward) {
                const existingUserBadge = await UserBadge.findOne({
                    user_id: participant.user,
                    badge_id: badgeToAward._id
                });

                console.log('Existing user badge check:', existingUserBadge);

                if (!existingUserBadge) {
                    const userBadge = new UserBadge({
                        user_id: participant.user,
                        badge_id: badgeToAward._id
                    });
                    await userBadge.save();
                    console.log(`${badgeToAward.name} badge awarded to user ${participant.user}`);
                } else {
                    console.log(`User already has ${badgeToAward.name} badge`);
                }
            }
            
            // Check for Challenge Hero badge (5 completed challenges)
            const completedChallenges = await ChallengeSubmission.countDocuments({
                user_id: participant.user,
                status: 'approved'
            });
            
            if (completedChallenges >= 5) {
                const challengeHeroBadge = await Badge.findOne({ name: 'Challenge Hero' });
                if (challengeHeroBadge) {
                    const existingHeroBadge = await UserBadge.findOne({
                        user_id: participant.user,
                        badge_id: challengeHeroBadge._id
                    });
                    
                    if (!existingHeroBadge) {
                        const heroBadge = new UserBadge({
                            user_id: participant.user,
                            badge_id: challengeHeroBadge._id
                        });
                        await heroBadge.save();
                        console.log(`Challenge Hero badge awarded to user`);
                    }
                }
            }
        }

        // Create notification for challenge approval
        if (status === 'approved') {
            try {
                const { createNotification } = require('./notifications');
                const user = await User.findById(participant.user);
                if (user) {
                    await createNotification(
                        user._id,
                        'challenge_approved',
                        'Challenge Approved!',
                        `Your challenge submission for "${challenge.title}" has been approved! You earned ${challenge.points || 50} points and a badge.`,
                        {
                            challengeId: challenge._id,
                            challengeTitle: challenge.title,
                            pointsEarned: challenge.points || 50,
                            participantId: participant._id
                        }
                    );
                    console.log(`Challenge approval notification created for user ${user.username}`);
                }
            } catch (notificationError) {
                console.error('Error creating challenge approval notification:', notificationError);
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
// @desc    Update a challenge (Admin/Partner only)
// @access  Private
router.put('/:id', [auth, roleCheck('admin', 'partner'), upload.single('badge')], async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        
        if (!challenge) {
            return res.status(404).json({ msg: 'Challenge not found' });
        }

        // Check if user is the creator or an admin
        const user = await User.findById(req.user.id);
        if (challenge.createdBy.toString() !== req.user.id && user.role !== 'admin') {
            return res.status(401).json({ msg: 'Not authorized to update this challenge' });
        }

        const {
            title,
            content,
            target,
            points,
            duration,
            location,
            badgeTitle
        } = req.body;

        if (title) challenge.title = title;
        if (content) challenge.description = content;
        if (target) challenge.target = parseInt(target);
        if (points) challenge.points = parseInt(points);
        if (duration) challenge.duration = duration;
        if (location) challenge.location = location;
        if (badgeTitle) challenge.badgeTitle = badgeTitle;

        // Handle badge image upload
        if (req.file) {
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'challenge-badges',
                transformation: [
                    { width: 200, height: 200, crop: 'fill' }
                ]
            });
            
            // Delete old badge if exists
            if (challenge.badge_url) {
                const publicId = challenge.badge_url.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`challenge-badges/${publicId}`);
            }
            
            challenge.badge_url = result.secure_url;
            
            // Delete local file
            fs.unlinkSync(req.file.path);
        }

        await challenge.save();
        res.json(challenge);
    } catch (err) {
        console.error('Error updating challenge:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET /api/challenges/:id/submissions/check
// @desc    Check if user has already submitted to this challenge
// @access  Private
router.get('/:id/submissions/check', auth, async (req, res) => {
    try {
        console.log(`Checking submission for challenge ${req.params.id} by user ${req.user.id}`);
        const existingSubmission = await ChallengeSubmission.findOne({
            challenge_id: req.params.id,
            user_id: req.user.id
        });

        console.log('Found submission:', existingSubmission);
        res.json(existingSubmission);
    } catch (err) {
        console.error('Error checking submission:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST /api/challenges
// @desc    Create a new community challenge (Admin/Partner only)
// @access  Private
router.post('/', [auth, roleCheck('admin', 'partner'), upload.fields([{ name: 'badge', maxCount: 1 }, { name: 'image', maxCount: 1 }]), handleUploadError], async (req, res) => {
    try {
        console.log('Creating challenge with data:', req.body);
        console.log('Files received:', req.files);
        
        const { title, content, target, points, duration, location, badgeTitle } = req.body;
        
        if (!title || !content || !target) {
            console.log('Missing required fields:', { title: !!title, content: !!content, target: !!target });
            return res.status(400).json({ msg: 'Title, content, and target are required' });
        }

        let badgeUrl = null;

        // Handle badge upload
        if (req.files && req.files.badge) {
            try {
                const badgeResult = await cloudinary.uploader.upload(req.files.badge[0].path, {
                    folder: 'challenge-badges',
                    resource_type: 'auto'
                });
                badgeUrl = badgeResult.secure_url;
                console.log('Challenge badge uploaded to Cloudinary');
            } catch (error) {
                console.error('Cloudinary badge upload error:', error);
                return res.status(500).json({ msg: 'Failed to upload badge' });
            }
        }

        const newChallenge = new Challenge({
            title,
            description: content,
            target: parseInt(target),
            currentProgress: 0,
            points: parseInt(points) || 50,
            duration: duration || '2-3 weeks',
            location: location || 'HAU Campus',
            badgeTitle: badgeTitle || '',
            badge_url: badgeUrl,
            createdBy: req.user.id,
            participants: [],
            isActive: true
        });

        const challenge = await newChallenge.save();

        // Clean up local files
        try {
            if (req.files && req.files.badge) {
                fs.unlinkSync(req.files.badge[0].path);
                console.log('Cleaned up badge file');
            }
            if (req.files && req.files.image) {
                fs.unlinkSync(req.files.image[0].path);
                console.log('Cleaned up image file');
            }
        } catch (cleanupError) {
            console.error('Error cleaning up files:', cleanupError);
            // Don't fail the request if cleanup fails
        }

        console.log(`New community challenge created: ${challenge.title}`);
        res.json(challenge);
    } catch (err) {
        console.error('Error creating challenge:', err.message);
        console.error('Full error:', err);
        
        // Clean up files if they exist and there was an error
        try {
            if (req.files && req.files.badge) {
                fs.unlinkSync(req.files.badge[0].path);
            }
            if (req.files && req.files.image) {
                fs.unlinkSync(req.files.image[0].path);
            }
        } catch (cleanupError) {
            console.error('Error cleaning up files after error:', cleanupError);
        }
        
        res.status(500).json({ msg: 'Server error', error: err.message });
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
// @access  Public
router.get('/submissions/user/:userId', async (req, res) => {
    try {
        const submissions = await ChallengeSubmission.find({ user_id: req.params.userId })
            .populate('challenge_id', 'title points category badgeTitle badge_url')
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
            const challenge = await Challenge.findById(submission.challenge_id);
            const user = await User.findById(submission.user_id);
            
            if (user && challenge) {
                // Award points to user (use challenge.points if available, otherwise 50)
                const pointsEarned = challenge.points || 50;
                user.points = (user.points || 0) + pointsEarned;
                user.eco_score = (user.eco_score || 0) + pointsEarned;
                
                // Add challenge to user's completed challenges
                if (!user.challengesCompleted.includes(challenge._id)) {
                    user.challengesCompleted.push(challenge._id);
                }
                
                // Add challenge badge to user's badges if it exists (simplified - only badgeTitle and badge_url)
                if (challenge.badge_url && challenge.badgeTitle) {
                    // Create a badge entry for the challenge
                    const challengeBadge = {
                        name: challenge.badgeTitle,
                        description: `Badge earned from completing ${challenge.title}`,
                        image_url: challenge.badge_url,
                        challenge_id: challenge._id
                    };
                    
                    // Add to user's badges array
                    if (!user.badges) user.badges = [];
                    user.badges.push(challengeBadge);
                }
                
                // Add challenge to challenge participants array
                if (!challenge.participants.includes(user._id)) {
                    challenge.participants.push(user._id);
                    await challenge.save();
                }
                
                await user.save();
                console.log(`Awarded ${pointsEarned} points and updated challenge completion for user ${user.username}`);

                // Create notification for challenge approval
                try {
                    const { createNotification } = require('./notifications');
                    await createNotification(
                        user._id,
                        'challenge_approved',
                        'Challenge Approved!',
                        `Your challenge submission for "${challenge.title}" has been approved! You earned ${pointsEarned} points and a badge.`,
                        {
                            challengeId: challenge._id,
                            challengeTitle: challenge.title,
                            pointsEarned: pointsEarned,
                            submissionId: submission._id
                        }
                    );
                    console.log(`Challenge approval notification created for user ${user.username}`);
                } catch (notificationError) {
                    console.error('Error creating challenge approval notification:', notificationError);
                }


                // Update challenge progress
                if (challenge) {
                    challenge.currentProgress = (challenge.currentProgress || 0) + 1;
                    challenge.current_progress = challenge.currentProgress; // Sync both fields
                    await challenge.save();
                    console.log(`Updated challenge progress to ${challenge.currentProgress}`);
                }
            }
        }

        // Create notification for challenge rejection
        if (status === 'rejected') {
            const challenge = await Challenge.findById(submission.challenge_id);
            const user = await User.findById(submission.user_id);
            
            if (user && challenge) {
                const { createNotification } = require('./notifications');
                await createNotification(
                    user._id,
                    'challenge_rejected',
                    'Challenge Submission Rejected',
                    `Your challenge submission for "${challenge.title}" was rejected.${rejection_reason ? ' Reason: ' + rejection_reason : ''}`,
                    {
                        challengeId: challenge._id,
                        challengeTitle: challenge.title,
                        submissionId: submission._id,
                        rejectionReason: rejection_reason
                    }
                );
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

