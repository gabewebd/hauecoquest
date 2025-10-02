const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('../models/User');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');

async function createBadges() {
  try {
    // Create unique badges
    const badges = [
      {
        name: 'First Quest Hero',
        description: 'Completed your very first quest!',
        image_url: '🏆',
        criteria: {
          type: 'quests_completed',
          threshold: 1
        }
      },
      {
        name: 'Community Champion',
        description: 'Participated in your first community challenge!',
        image_url: '🌟',
        criteria: {
          type: 'special',
          threshold: 1
        }
      }
    ];

    // Clear existing badges
    await Badge.deleteMany({});
    await UserBadge.deleteMany({});

    // Create badges
    const createdBadges = await Badge.insertMany(badges);
    console.log('Created badges:', createdBadges);

    // Find the student user
    const student = await User.findOne({ email: 'student@hau.edu.ph' });
    if (!student) {
      console.log('Student user not found');
      return;
    }

    // Assign badges to student
    const userBadges = [
      {
        user_id: student._id,
        badge_id: createdBadges[0]._id, // First Quest Hero
        earned_at: new Date()
      },
      {
        user_id: student._id,
        badge_id: createdBadges[1]._id, // Community Champion
        earned_at: new Date()
      }
    ];

    await UserBadge.insertMany(userBadges);
    console.log('Assigned badges to student');

    console.log('Badge system setup complete!');
  } catch (error) {
    console.error('Error creating badges:', error);
  } finally {
    mongoose.connection.close();
  }
}

createBadges();
