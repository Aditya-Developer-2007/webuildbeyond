const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ─────────────────────────────────────────
// @route  GET /api/visitors
// @desc   Get all signed-up visitors (admin only)
// @access Private/Admin
// ─────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const visitors = await User.find({ isAdmin: false })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ visitors, total: visitors.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────
// @route  GET /api/visitors/stats
// @desc   Get visitor stats summary
// @access Private/Admin
// ─────────────────────────────────────────
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalVisitors  = await User.countDocuments({ isAdmin: false });
    const today = new Date(); today.setHours(0,0,0,0);
    const todayVisitors  = await User.countDocuments({ isAdmin: false, createdAt: { $gte: today } });
    const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
    const weekVisitors   = await User.countDocuments({ isAdmin: false, createdAt: { $gte: weekAgo } });

    res.json({ totalVisitors, todayVisitors, weekVisitors });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
