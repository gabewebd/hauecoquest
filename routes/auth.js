//Josh Andrei Aguiluz
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth'); // Middleware to protect routes

// ROUTE 1: Create a User (Sign Up) at POST "/api/auth/signup"
router.post('/signup', async (req, res) => {
  try {
    // Check if a user with this email already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry, a user with this email already exists." });
    }

    // Create a new user with the data from the request
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    
    // The password will be hashed automatically by the pre-save hook in User.js
    await user.save();
    
    res.status(201).json({ success: true, message: "User created successfully!" });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some internal server error occurred.");
  }
});

// ROUTE 2: Authenticate a User (Login) at POST "/api/auth/login"
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // Use our custom method to compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        // If credentials are correct, create a JWT token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }, // Token expires in 24 hours
            (err, token) => {
                if (err) throw err;
                res.json({ success: true, token });
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});

// ROUTE 3: Get Logged In User's Data at GET "/api/auth/user"
// This is a protected route that uses our auth middleware.
router.get('/user', auth, async (req, res) => {
  try {
    // req.user is set by the auth middleware from the token
    const user = await User.findById(req.user.id).select('-password'); // .select('-password') prevents sending the hashed password
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;