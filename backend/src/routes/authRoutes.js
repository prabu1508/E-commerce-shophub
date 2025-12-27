const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const { validateRegister, validateLogin } = require('../middleware/validator');

// Helper: create token
function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '30d' 
  });
}

// Register
router.post('/register', validateRegister, asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email already registered' 
    });
  }

  const user = await User.create({ 
    name: name.trim(), 
    email: email.toLowerCase(), 
    password 
  });
  
  const token = createToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin 
    }
  });
}));

// Login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid email or password' 
    });
  }

  const token = createToken(user._id);
  
  res.json({ 
    success: true,
    token, 
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      isAdmin: user.isAdmin 
    } 
  });
}));

// Get current user
router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json({ 
    success: true,
    user: { 
      id: req.user._id, 
      name: req.user.name, 
      email: req.user.email, 
      isAdmin: req.user.isAdmin 
    } 
  });
}));

module.exports = router;
