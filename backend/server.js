const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
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
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Verify SMTP settings on startup
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      await transporter.verify();
      console.log('✅ SMTP Mail connection ready');
    } catch (mailErr) {
      console.error('\n⚠️  EMAIL CONFIGURATION ERROR:');
      console.error('❌ Could not connect to your Gmail account for sending emails.');
      console.error('If you are using Gmail, your normal password will not work.');
      console.error('Please generate an "App Password" in your Google Account Security settings and put it in your .env file as EMAIL_PASS.');
      console.error(`Current .env user: ${process.env.EMAIL_USER || 'Not set'}`);
      console.error('Detailed Error:', mailErr.message, '\n');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Server start error:', err.message || err);
    process.exit(1);
  });
