require('dotenv').config();
const mongoose = require('mongoose');
const Challenge = require('../models/Challenge');
const Badge = require('../models/Badge');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hau-eco-quest');
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const initializeTreeChallenge = async () => {
  try {
    await connectDB();

    // Create Tree Master Badge
    const existingBadge = await Badge.findOne({ name: 'Tree Master' });
    
    if (!existingBadge) {
      const treeMasterBadge = new Badge({
        name: 'Tree Master',
        description: 'Awarded for joining the Plant 1000 Trees community challenge',
        icon_url: '🌳',
        category: 'Community',
        points_required: 0
      });
      await treeMasterBadge.save();
      console.log('✅ Tree Master badge created');
    } else {
      console.log('Tree Master badge already exists');
    }

    // Create 1000 Trees Challenge
    const existingChallenge = await Challenge.findOne({ title: 'Plant 1000 Trees' });
    
    if (!existingChallenge) {
      const treesChallenge = new Challenge({
        title: 'Plant 1000 Trees',
        description: 'Join our community in planting 1000 trees to combat climate change and restore our environment. Every participant receives the Tree Master badge!',
        goal: 1000,
        currentProgress: 0,
        category: 'Environmental',
        badgeReward: 'Tree Master',
        isActive: true,
        imageUrl: '/images/tree-challenge.jpg'
      });
      await treesChallenge.save();
      console.log('✅ Plant 1000 Trees challenge created');
    } else {
      console.log('Plant 1000 Trees challenge already exists');
    }

    console.log('\n✨ Tree challenge initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

initializeTreeChallenge();

