const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [2000, 'Message too long'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
