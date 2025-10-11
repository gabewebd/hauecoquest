const mongoose = require('mongoose');

const ChallengeSubmissionSchema = new mongoose.Schema({
    challenge_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Challenge',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reflection_text: {
        type: String,
        required: true
    },
    photo_url: {
        type: String,
        required: true
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
    },
    rejection_reason: {
        type: String
    },
    submitted_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ChallengeSubmission', ChallengeSubmissionSchema);
