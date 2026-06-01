const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   POST api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (username.length < 3) {
      return res.status(400).json({ msg: 'Username must be at least 3 characters long' });
    }

    // Password strength validation
    if (password.length < 8) {
      return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ msg: 'Password must contain at least one capital letter' });
    }
    if (!/\d/.test(password)) {
      return res.status(400).json({ msg: 'Password must contain at least one number' });
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return res.status(400).json({ msg: 'Password must contain at least one special character (e.g. @, $, !, %, *, ?, &, #, etc.)' });
    }

    // 2. Check if user already exists (by email or username)
    let userByEmail = await User.findOne({ email: email.toLowerCase() });
    if (userByEmail) {
      return res.status(400).json({ msg: 'A user with this email already exists' });
    }

    let userByUsername = await User.findOne({ username: username.trim() });
    if (userByUsername) {
      return res.status(400).json({ msg: 'This username is already taken' });
    }

    // 3. Create new user instance
    const newUser = new User({
      username: username.trim(),
      email: email.toLowerCase(),
      password
    });

    // 4. Hash password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // 5. Save to database
    await newUser.save();

    // 6. Generate JWT token
    const payload = {
      user: {
        id: newUser.id,
        username: newUser.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // Valid for 7 days
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
          }
        });
      }
    );

  } catch (err) {
    console.error('Signup Error:', err.message);
    res.status(500).send('Server Error during signup');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // 2. Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    // 4. Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      }
    );

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server Error during login');
  }
});

// @route   GET api/auth/me
// @desc    Get current user details using token
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Fetch Current User Error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
