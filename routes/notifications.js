const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Helper function to create notifications
const createNotification = async (userId, type, title, message, data = {}) => {
  try {
    console.log(`Creating notification: type=${type}, userId=${userId}, title=${title}`);
    const notification = new Notification({
      user_id: userId,
      type,
      title,
      message,
      data
    });
    const savedNotification = await notification.save();
    console.log(`Notification created successfully with ID: ${savedNotification._id}`);
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    console.error('Notification data:', { userId, type, title, message, data });
    return null;
  }
};

// Export the helper function for use in other routes
router.createNotification = createNotification;

// @route   POST /api/notifications/test
// @desc    Create a test notification for debugging
// @access  Private
router.post('/test', auth, async (req, res) => {
  try {
    const testNotification = new Notification({
      user_id: req.user.id,
      type: 'quest_completed',
      title: 'Test Notification',
      message: 'This is a test notification to check if the system is working.',
      data: { test: true }
    });
    
    await testNotification.save();
    console.log('Test notification created for user:', req.user.id);
    res.json({ msg: 'Test notification created', notification: testNotification });
  } catch (err) {
    console.error('Error creating test notification:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/notifications/test-challenge
// @desc    Create a test challenge approval notification for debugging
// @access  Private
router.post('/test-challenge', auth, async (req, res) => {
  try {
    const testNotification = new Notification({
      user_id: req.user.id,
      type: 'challenge_approved',
      title: 'Challenge Approved!',
      message: 'Your challenge submission for "Plant Trees Challenge" has been approved! You earned 50 points and a badge.',
      data: { 
        challengeId: 'test-challenge-id',
        challengeTitle: 'Plant Trees Challenge',
        pointsEarned: 50,
        submissionId: 'test-submission-id'
      }
    });
    
    await testNotification.save();
    console.log('Test challenge notification created for user:', req.user.id);
    res.json({ msg: 'Test challenge notification created', notification: testNotification });
  } catch (err) {
    console.error('Error creating test challenge notification:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET /api/notifications
// @desc    Get notifications for current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching notifications for user:', req.user.id);
    const notifications = await Notification.find({ user_id: req.user.id })
      .sort({ created_at: -1 })
      .limit(50);
    
    console.log('Found notifications:', notifications.length);
    res.json(notifications);
  } catch (err) {
    console.error('Error fetching notifications:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    await Notification.updateMany(
      { user_id: req.user.id, is_read: false },
      { is_read: true }
    );

    res.json({ msg: 'All notifications marked as read' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ msg: 'Notification not found' });
    }

    res.json({ msg: 'Notification deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = { router, createNotification };












