const mongoose = require('mongoose');

const ChallengeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    goal: {
        type: Number,
        required: true,
        default: 1000
    },
    currentProgress: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: 'Environmental'
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        contributedAt: {
            type: Date,
            default: Date.now
        },
        contribution: {
            type: Number,
            default: 1
        },
        photo_url: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
        reviewed_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        reviewed_at: {
            type: Date
        }
    }],
    badgeReward: {
        type: String,
        default: 'Tree Master'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    imageUrl: {
        type: String,
        default: ''
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);

