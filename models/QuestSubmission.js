const mongoose = require('mongoose');

const QuestSubmissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quest_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quest',
        required: true
    },
    photo_url: {
        type: String,
        default: ''
    },
    reflection_text: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submitted_at: {
        type: Date,
        default: Date.now
    },
    reviewed_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewed_at: {
        type: Date
    },
    rejection_reason: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('QuestSubmission', QuestSubmissionSchema);

