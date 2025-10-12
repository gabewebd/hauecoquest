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

// Middleware to add user to challenge participants when approved
ChallengeSubmissionSchema.post('findOneAndUpdate', async function(doc) {
    if (doc && doc.status === 'approved') {
        const Challenge = require('./Challenge');
        const User = require('./User');
        
        try {
            // Add user to challenge participants
            await Challenge.findByIdAndUpdate(
                doc.challenge_id,
                { $addToSet: { participants: doc.user_id } }
            );
            
            // Add challenge to user's completed challenges
            await User.findByIdAndUpdate(
                doc.user_id,
                { $addToSet: { challengesCompleted: doc.challenge_id } }
            );
            
            console.log(`Added user ${doc.user_id} to challenge ${doc.challenge_id} participants`);
        } catch (error) {
            console.error('Error updating challenge participants:', error);
        }
    }
});

module.exports = mongoose.model('ChallengeSubmission', ChallengeSubmissionSchema);
