const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes    = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const visitorRoutes = require('./routes/visitor');

const app = express();

// ── Middleware ──
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// ── Routes ──
app.use('/api/auth',     authRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/visitors', visitorRoutes);

// ── Health check ──
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'We Build Beyond API running 🚀' }));

// ── 404 handler ──
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// ── Error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ── Connect & Start ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
