const mongoose = require('mongoose');
const Badge = require('../models/Badge');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hau_eco_quest', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const badges = [
    {
        name: "First Quest",
        description: "Complete your first environmental quest",
        image_url: "/images/badges/first-quest.png",
        criteria: {
            type: "first_quest",
            value: 1
        }
    },
    {
        name: "Quest Master",
        description: "Complete 10 environmental quests",
        image_url: "/images/badges/quest-master.png",
        criteria: {
            type: "quests_completed",
            value: 10
        }
    },
    {
        name: "Energy Master",
        description: "Complete 10 energy conservation quests",
        image_url: "/images/badges/energy-master.png",
        criteria: {
            type: "energy_conservation",
            value: 10
        }
    },
    {
        name: "Water Guardian",
        description: "Save 500 liters of water",
        image_url: "/images/badges/water-guardian.png",
        criteria: {
            type: "water_saved",
            value: 500
        }
    },
    {
        name: "Community Champion",
        description: "Join your first community challenge",
        image_url: "/images/badges/community-champion.png",
        criteria: {
            type: "challenge_joined",
            value: 1
        }
    },
    {
        name: "Tree Master",
        description: "Complete a community tree planting challenge",
        image_url: "/images/badges/tree-master.png",
        criteria: {
            type: "challenge_completed",
            value: 1
        }
    },
    {
        name: "Challenge Hero",
        description: "Complete 5 community challenges",
        image_url: "/images/badges/challenge-hero.png",
        criteria: {
            type: "challenges_completed",
            value: 5
        }
    }
];

async function initializeBadges() {
    try {
        // Clear existing badges
        await Badge.deleteMany({});
        console.log('Cleared existing badges');

        // Create new badges
        for (const badgeData of badges) {
            const badge = new Badge(badgeData);
            await badge.save();
            console.log(`Created badge: ${badge.name}`);
        }

        console.log('✅ Badges initialized successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error initializing badges:', error);
        process.exit(1);
    }
}

initializeBadges();












