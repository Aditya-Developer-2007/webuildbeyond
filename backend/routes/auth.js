const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ─────────────────────────────────────────
// @route  POST /api/auth/signup
// @desc   Register new visitor
// @access Public
// ─────────────────────────────────────────
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email });
      if (existing) return res.status(409).json({ message: 'Email already registered' });

      const user = await User.create({
        name,
        email,
        password,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        lastLogin: new Date(),
        loginCount: 1,
      });

      res.status(201).json({
        message: 'Account created successfully!',
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ message: 'Server error during signup' });
    }
  }
);

// ─────────────────────────────────────────
// @route  POST /api/auth/login
// @desc   Login existing user
// @access Public
// ─────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

      // Update tracking info
      user.lastLogin = new Date();
      user.loginCount += 1;
      user.ipAddress = req.ip;
      user.userAgent = req.headers['user-agent'];
      await user.save();

      res.json({
        message: 'Login successful',
        token: generateToken(user._id),
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// ─────────────────────────────────────────
// @route  GET /api/auth/me
// @desc   Get current logged-in user
// @access Private
// ─────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
