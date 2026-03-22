/**
 * Run this ONCE to create your admin account:
 *   node createAdmin.js
 *
 * Make sure your .env is filled in first!
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN = {
  name:     'Admin',
  email:    'admin@webuildbeyond.com',  // ← Change this
  password: 'Admin@1234',               // ← Change this
  isAdmin:  true,
};

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const existing = await User.findOne({ email: ADMIN.email });
    if (existing) {
      console.log('⚠️  Admin already exists:', existing.email);
      process.exit(0);
    }

    const admin = await User.create(ADMIN);
    console.log('🎉 Admin created successfully!');
    console.log('   Email   :', admin.email);
    console.log('   Password: Admin@1234  (change this after first login)');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
