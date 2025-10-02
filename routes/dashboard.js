const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Quest = require('../models/Quest');
const QuestSubmission = require('../models/QuestSubmission');
const UserBadge = require('../models/UserBadge');
const Post = require('../models/Post');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/stats
// @desc    Get user dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('questsCompleted');
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get user's quest submissions
        const submissions = await QuestSubmission.find({ user_id: req.user.id })
            .populate('quest_id', 'title points category')
            .sort({ submitted_at: -1 });

        // Get user's badges
        const userBadges = await UserBadge.find({ user_id: req.user.id })
            .populate('badge_id')
            .sort({ earned_at: -1 });

        // Get all active quests
        const allQuests = await Quest.find({ isActive: true });

        // Get user's posts
        const userPosts = await Post.find({ author: req.user.id })
            .sort({ created_at: -1 })
            .limit(5);

        // Calculate statistics
        const completedQuests = submissions.filter(s => s.status === 'approved').length;
        const inProgressQuests = submissions.filter(s => s.status === 'pending').length;
        const rejectedQuests = submissions.filter(s => s.status === 'rejected').length;

        // Calculate category progress
        const categoryProgress = {};
        allQuests.forEach(quest => {
            const category = quest.category;
            if (!categoryProgress[category]) {
                categoryProgress[category] = { completed: 0, total: 0 };
            }
            categoryProgress[category].total++;
            
            const userCompletedInCategory = submissions.some(
                s => s.quest_id && s.quest_id._id.toString() === quest._id.toString() && s.status === 'approved'
            );
            if (userCompletedInCategory) {
                categoryProgress[category].completed++;
            }
        });

        // Calculate streaks
        const approvedSubmissions = submissions
            .filter(s => s.status === 'approved')
            .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));

        const currentStreak = calculateCurrentStreak(approvedSubmissions);
        const longestStreak = calculateLongestStreak(approvedSubmissions);

        // Calculate weekly and monthly stats
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const weeklySubmissions = submissions.filter(s => 
            s.status === 'approved' && new Date(s.submitted_at) >= oneWeekAgo
        );
        const weeklyPoints = weeklySubmissions.reduce((sum, s) => sum + (s.quest_id?.points || 0), 0);

        const monthlyQuests = submissions.filter(s => 
            s.status === 'approved' && new Date(s.submitted_at) >= oneMonthAgo
        ).length;

        // Calculate level based on eco points
        const level = calculateLevel(user.eco_score || user.points || 0);

        // Calculate progress to next level
        const pointsForNextLevel = (level + 1) * 100;
        const currentLevelMinPoints = level * 100;
        const progressToNextLevel = Math.min(
            ((user.eco_score || user.points || 0) - currentLevelMinPoints) / (pointsForNextLevel - currentLevelMinPoints) * 100,
            100
        );

        const dashboardStats = {
            // User info
            username: user.username,
            email: user.email,
            role: user.role,
            avatar_theme: user.avatar_theme,
            header_theme: user.header_theme,

            // Points and level
            points: user.points || 0,
            eco_score: user.eco_score || 0,
            level: level,
            progressToNextLevel: Math.round(progressToNextLevel),
            pointsForNextLevel: pointsForNextLevel,

            // Quest stats
            questsCompleted: completedQuests,
            questsInProgress: inProgressQuests,
            questsRejected: rejectedQuests,
            availableQuests: allQuests.length,

            // Badges
            badgesEarned: userBadges.length,
            totalBadgesAvailable: 35, // This could be dynamic from Badge collection

            // Streaks
            currentStreak: currentStreak,
            longestStreak: longestStreak,

            // Time-based stats
            weeklyPoints: weeklyPoints,
            monthlyQuests: monthlyQuests,

            // Category progress
            categoryProgress: categoryProgress,

            // Recent activity (submissions + posts)
            recentSubmissions: approvedSubmissions.slice(0, 5).map(s => ({
                _id: s._id,
                quest: s.quest_id?.title || 'Quest',
                points: s.quest_id?.points || 0,
                submittedAt: s.submitted_at,
                status: s.status
            })),

            recentPosts: userPosts.map(p => ({
                _id: p._id,
                title: p.title,
                createdAt: p.created_at
            })),

            // Badge collection
            badges: userBadges.map(ub => ({
                _id: ub._id,
                name: ub.badge_id?.name,
                description: ub.badge_id?.description,
                icon_url: ub.badge_id?.icon_url,
                earnedAt: ub.earned_at
            }))
        };

        console.log(`Dashboard stats for user ${user.username}: Level ${level}, ${user.points} points, ${completedQuests} quests completed`);
        res.json(dashboardStats);

    } catch (err) {
        console.error('Error fetching dashboard stats:', err.message);
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});

// Helper function to calculate current streak
function calculateCurrentStreak(approvedSubmissions) {
    if (approvedSubmissions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let submission of approvedSubmissions) {
        const submissionDate = new Date(submission.submitted_at);
        submissionDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor((currentDate - submissionDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === streak) {
            streak++;
        } else if (dayDiff > streak) {
            break;
        }
    }

    return streak;
}

// Helper function to calculate longest streak
function calculateLongestStreak(approvedSubmissions) {
    if (approvedSubmissions.length === 0) return 0;

    const sortedSubmissions = [...approvedSubmissions].sort(
        (a, b) => new Date(a.submitted_at) - new Date(b.submitted_at)
    );

    let longestStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < sortedSubmissions.length; i++) {
        const prevDate = new Date(sortedSubmissions[i - 1].submitted_at);
        const currDate = new Date(sortedSubmissions[i].submitted_at);
        
        prevDate.setHours(0, 0, 0, 0);
        currDate.setHours(0, 0, 0, 0);

        const dayDiff = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else if (dayDiff > 1) {
            currentStreak = 1;
        }
    }

    return longestStreak;
}

// Helper function to calculate level from eco points
function calculateLevel(ecoPoints) {
    // Level 1: 0-99 points
    // Level 2: 100-199 points
    // Level 3: 200-299 points, etc.
    return Math.floor(ecoPoints / 100);
}

module.exports = router;

