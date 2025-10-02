const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const UserBadge = require('../models/UserBadge');
const Badge = require('../models/Badge');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/roleCheck');

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
router.post('/', [auth, checkRole('admin', 'partner')], async (req, res) => {
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
// @desc    Join a challenge (Users only - not admin/partner)
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
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

        const { contribution } = req.body;
        const contributionAmount = contribution || 1;

        // Add user to participants
        challenge.participants.push({
            user: req.user.id,
            contribution: contributionAmount
        });

        // Update progress
        challenge.currentProgress += contributionAmount;

        await challenge.save();

        // Award "Tree Master" badge
        const treeMasterBadge = await Badge.findOne({ name: 'Tree Master' });
        
        if (treeMasterBadge) {
            // Check if user already has this badge
            const existingUserBadge = await UserBadge.findOne({
                user_id: req.user.id,
                badge_id: treeMasterBadge._id
            });

            if (!existingUserBadge) {
                const userBadge = new UserBadge({
                    user_id: req.user.id,
                    badge_id: treeMasterBadge._id
                });
                await userBadge.save();
                console.log(`Tree Master badge awarded to user ${user.username}`);
            }
        }

        console.log(`User ${user.username} joined challenge: ${challenge.title}. Progress: ${challenge.currentProgress}/${challenge.goal}`);

        res.json({ 
            msg: 'Successfully joined challenge and earned Tree Master badge!', 
            challenge,
            badgeAwarded: treeMasterBadge ? true : false
        });
    } catch (err) {
        console.error('Error joining challenge:', err.message);
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
router.put('/:id', [auth, checkRole('admin')], async (req, res) => {
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

// @route   DELETE /api/challenges/:id
// @desc    Delete a challenge (Admin only)
// @access  Private
router.delete('/:id', [auth, checkRole('admin')], async (req, res) => {
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

