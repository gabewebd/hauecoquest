//Josh Andrei Aguiluz
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    console.log('Signup request:', { username, email, role });

    // Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "Sorry, a user with this email already exists." });
    }

    // Create a new user with all default fields
    user = new User({
      username,
      email,
      password,
      role: role || 'user',
      eco_score: 0,
      points: 0,
      profile_picture_url: '',
      hau_affiliation: '',
      avatar_theme: 'Girl Avatar 1',
      header_theme: 'orange',
            is_approved: role === 'user' ? true : false, // Auto-approve regular users, require approval for partner and admin
      questsCompleted: [],
      created_at: new Date()
    });
    
    await user.save();
    console.log('User saved successfully:', user._id);
    
    // Create token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 'undefined');
    
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('JWT error:', err);
          return res.status(500).json({ success: false, error: "Token generation failed" });
        }
        console.log('Token generated successfully');
        res.status(201).json({ 
          success: true, 
          message: role === 'user' ? 'User created successfully!' : 'Request submitted. Awaiting approval.',
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            eco_score: user.eco_score,
            points: user.points,
            profile_picture_url: user.profile_picture_url,
            hau_affiliation: user.hau_affiliation,
            avatar_theme: user.avatar_theme,
            header_theme: user.header_theme,
            is_approved: user.is_approved,
            questsCompleted: user.questsCompleted,
            created_at: user.created_at
          }
        });
      }
    );

  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ success: false, error: "Some internal server error occurred." });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Check if partner is approved
    if (user.role === 'partner' && !user.is_approved) {
      return res.status(403).json({ error: "Your partner account is pending approval." });
    }

    // Use our custom method to compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials." });
    }

    // Create a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          success: true, 
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            eco_score: user.eco_score,
            points: user.points,
            profile_picture_url: user.profile_picture_url,
            hau_affiliation: user.hau_affiliation,
            avatar_theme: user.avatar_theme,
            header_theme: user.header_theme,
            is_approved: user.is_approved,
            questsCompleted: user.questsCompleted,
            created_at: user.created_at
          }
        });
      }
    );

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
});

// @route   GET /api/auth/me
// @desc    Get logged in user's data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('questsCompleted', 'title points');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST /api/auth/request-partner-access
// @desc    Request partner access for existing user
// @access  Private
router.post('/request-partner-access', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role === 'partner' || user.role === 'admin') {
      return res.status(400).json({ msg: 'User already has elevated privileges' });
    }

    user.role = 'partner';
    user.is_approved = false;
    await user.save();

    res.json({ msg: 'Partner access requested. Awaiting admin approval.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;