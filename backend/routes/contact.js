const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── Email transporter ──
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─────────────────────────────────────────
// @route  POST /api/contact
// @desc   Submit contact form → save to DB + email notification
// @access Public
// ─────────────────────────────────────────
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required')
      .isLength({ max: 2000 }).withMessage('Message too long'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ message: errors.array()[0].msg });

    const { name, email, message } = req.body;

    try {
      // 1. Save to MongoDB
      const contact = await Contact.create({
        name,
        email,
        message,
        ipAddress: req.ip,
      });

      // 2. Send email notification to site owner
      const ownerMailOptions = {
        from: `"We Build Beyond" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `📬 New Contact from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#6C63FF,#9333ea);padding:28px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:22px;">New Contact Message</h1>
            </div>
            <div style="padding:28px;">
              <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
              <p style="margin:0 0 8px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p style="margin:0 0 16px;"><strong>Message:</strong></p>
              <div style="background:#f9f9f9;border-left:4px solid #6C63FF;padding:16px;border-radius:6px;">
                <p style="margin:0;white-space:pre-wrap;">${message}</p>
              </div>
              <p style="color:#888;font-size:12px;margin-top:20px;">Received: ${new Date().toLocaleString()}</p>
            </div>
          </div>`,
      };

      // 3. Send auto-reply to sender
      const autoReplyOptions = {
        from: `"We Build Beyond" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✅ We received your message, ${name}!`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#6C63FF,#9333ea);padding:28px;text-align:center;">
              <h1 style="color:white;margin:0;font-size:22px;">We Build Beyond</h1>
            </div>
            <div style="padding:28px;">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thanks for reaching out! We've received your message and will get back to you within <strong>24 hours</strong>.</p>
              <p style="color:#888;font-size:13px;">Your message:<br/><em>${message.substring(0, 200)}${message.length > 200 ? '...' : ''}</em></p>
              <hr style="border:none;border-top:1px solid #eee;margin:20px 0;"/>
              <p style="color:#888;font-size:12px;">© 2026 We Build Beyond · <a href="mailto:hello@webuildbeyond.com">hello@webuildbeyond.com</a></p>
            </div>
          </div>`,
      };

      // Fire emails (non-blocking — don't fail request if email fails)
      transporter.sendMail(ownerMailOptions).catch(e => console.error('Owner email error:', e));
      transporter.sendMail(autoReplyOptions).catch(e => console.error('Auto-reply error:', e));

      res.status(201).json({ message: 'Message sent successfully! We\'ll reply within 24 hours.' });
    } catch (err) {
      console.error('Contact form error:', err);
      res.status(500).json({ message: 'Failed to send message. Try again.' });
    }
  }
);

// ─────────────────────────────────────────
// @route  GET /api/contact
// @desc   Get all contact submissions (admin only)
// @access Private/Admin
// ─────────────────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json({ contacts, total: contacts.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─────────────────────────────────────────
// @route  PATCH /api/contact/:id/status
// @desc   Update contact status (admin only)
// @access Private/Admin
// ─────────────────────────────────────────
router.patch('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ contact });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
