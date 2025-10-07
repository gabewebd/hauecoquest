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
    const { username, email, password, role, department } = req.body;
    console.log('Signup request:', { username, email, department });

    // Check if a user with this email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: "Sorry, a user with this email already exists." });
    }

    // Create a new user - everyone starts as 'user' role
    user = new User({
      username,
      email,
      password,
      department,
      role: 'user', // Everyone starts as user
      requested_role: null, // No role requests during signup
      eco_score: 0,
      points: 0,
      profile_picture_url: '',
      hau_affiliation: '',
      avatar_theme: 'Girl Avatar 1',
      header_theme: 'orange',
      is_approved: true, // All users are approved by default
      is_original_admin: false,
      questsCompleted: [],
      created_at: new Date()
    });

    await user.save();
    console.log('User created successfully:', user._id);

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
          message: 'User created successfully!',
          token,
          user: {
            _id: user._id,
            username: user.username,
            email: user.email,
            department: user.department,
            role: user.role,
            requested_role: user.requested_role,
            eco_score: user.eco_score,
            points: user.points,
            profile_picture_url: user.profile_picture_url,
            hau_affiliation: user.hau_affiliation,
            avatar_theme: user.avatar_theme,
            header_theme: user.header_theme,
            is_approved: user.is_approved,
            is_original_admin: user.is_original_admin,
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

    // Check if user has a pending role request (partner or admin) - allow login but with limited access
    if (user.requested_role && !user.is_approved) {
      // They can login but will be redirected to dashboard showing pending status
      console.log(`User ${user.email} logging in with pending ${user.requested_role} request`);
    } else if (user.role !== 'user' && user.is_approved) {
      console.log(`Approved ${user.role} ${user.email} logging in`);
    }

    // Check if partner/admin is approved (in case they somehow got the role without approval)
    if ((user.role === 'partner' || user.role === 'admin') && !user.is_approved) {
      return res.status(403).json({ error: "Your account is pending approval." });
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
            department: user.department,
            role: user.role,
            requested_role: user.requested_role,
            eco_score: user.eco_score,
            points: user.points,
            profile_picture_url: user.profile_picture_url,
            hau_affiliation: user.hau_affiliation,
            avatar_theme: user.avatar_theme,
            header_theme: user.header_theme,
            is_approved: user.is_approved,
            is_original_admin: user.is_original_admin,
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

// @route   POST /api/auth/request-role
// @desc    Request partner or admin access for existing user
// @access  Private
router.post('/request-role', auth, async (req, res) => {
  console.log('=== ROLE REQUEST ENDPOINT HIT ===');
  console.log('Request body:', req.body);
  console.log('User from middleware:', req.user);

  try {
    const { roleRequested } = req.body;
    console.log('Role request received:', { roleRequested, userId: req.user.id });

    // Validate input
    if (!roleRequested || !['partner', 'admin'].includes(roleRequested)) {
      console.log('Invalid role requested:', roleRequested);
      return res.status(400).json({
        success: false,
        msg: 'Invalid role requested. Must be partner or admin.'
      });
    }

    // Find user in database
    const user = await User.findById(req.user.id);
    console.log('User found:', {
      id: user?._id,
      role: user?.role,
      requested_role: user?.requested_role,
      is_approved: user?.is_approved
    });

    if (!user) {
      console.log('User not found in database');
      return res.status(404).json({
        success: false,
        msg: 'User not found'
      });
    }

    // Validate user can make request
    if (user.role !== 'user') {
      console.log('User is not a regular user, role:', user.role);
      return res.status(400).json({
        success: false,
        msg: 'Only regular users can request role upgrades'
      });
    }

    if (user.requested_role) {
      console.log('User already has pending request:', user.requested_role);
      return res.status(400).json({
        success: false,
        msg: 'You already have a pending role request'
      });
    }

    // Update user with request
    user.requested_role = roleRequested;
    user.is_approved = false;
    await user.save();

    console.log('Role request saved successfully:', {
      requested_role: user.requested_role,
      is_approved: user.is_approved
    });

    const roleTitle = roleRequested === 'partner' ? 'Partner' : 'Admin';

    const response = {
      success: true,
      msg: `${roleTitle} access requested successfully. Awaiting admin approval.`,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        requested_role: user.requested_role,
        is_approved: user.is_approved
      }
    };

    console.log('Sending response:', response);
    res.status(200).json(response);

  } catch (err) {
    console.error('Role request error:', err);
    res.status(500).json({
      success: false,
      msg: 'Server error',
      error: err.message
    });
  }
});

// @route   GET /api/auth/test-role
// @desc    Test endpoint for role functionality
// @access  Private
router.get('/test-role', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      msg: 'Role test endpoint working',
      user: req.user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: 'Test endpoint error'
    });
  }
});

module.exports = router;