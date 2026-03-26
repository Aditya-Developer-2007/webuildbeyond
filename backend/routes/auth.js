const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Reset tokens store
const resetTokens = new Map();

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Gmail transporter
const nodemailer = require('nodemailer');
const createTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────
// @route  POST /api/auth/signup
// @access Public
// ─────────────────────────────────────────
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { name, email, password } = req.body;

    try {
      const existing = await User.findOne({ email: email.toLowerCase().trim() });
      if (existing) return res.status(409).json({ message: 'Email already registered' });

      const user = await User.create({
        name,
        email: email.toLowerCase().trim(),
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
// @access Public
// ─────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
      if (!user) return res.status(401).json({ message: 'Invalid email or password' });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

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
// @access Private
// ─────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ─────────────────────────────────────────
// @route  POST /api/auth/forgot-password
// @access Public
// ─────────────────────────────────────────
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'No account found with this email' });

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens.set(token, {
      userId: user._id,
      expires: Date.now() + 15 * 60 * 1000,
    });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"We Build Beyond" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🔐 Reset Your Password — We Build Beyond',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#6C63FF,#9333ea);padding:28px;text-align:center;">
            <h1 style="color:white;margin:0;font-size:22px;">Reset Your Password</h1>
          </div>
          <div style="padding:28px;">
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Click below to reset your password. Link expires in <strong>15 minutes</strong>.</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="${resetLink}" style="background:linear-gradient(135deg,#6C63FF,#9333ea);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;font-size:15px;">
                Reset Password →
              </a>
            </div>
            <p style="color:#888;font-size:12px;">If you didn't request this, ignore this email.</p>
          </div>
        </div>`,
    });

    res.json({ message: 'Reset link sent! Check your email 📧' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to send reset email. Try again.' });
  }
});

// ─────────────────────────────────────────
// @route  POST /api/auth/reset-password
// @access Public
// ─────────────────────────────────────────
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    const data = resetTokens.get(token);
    if (!data || Date.now() > data.expires)
      return res.status(400).json({ message: 'Reset link has expired or is invalid' });

    const user = await User.findById(data.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = password;
    await user.save();
    resetTokens.delete(token);

    res.json({ message: 'Password reset successfully! Please login.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;