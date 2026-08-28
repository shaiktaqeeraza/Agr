const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const createNotification = require('../utils/createNotification');

const router = express.Router();

// @route   GET /api/chat/conversations
// @desc    List distinct conversations (people the user has chatted with) with last message
router.get('/conversations', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({ $or: [{ sender: userId }, { receiver: userId }] }).sort('-createdAt');

    const map = new Map();
    for (const msg of messages) {
      const otherId = msg.sender.toString() === userId.toString() ? msg.receiver.toString() : msg.sender.toString();
      if (!map.has(otherId)) {
        map.set(otherId, { lastMessage: msg.text, lastMessageAt: msg.createdAt, unread: 0 });
      }
      if (msg.receiver.toString() === userId.toString() && !msg.isRead) {
        map.get(otherId).unread += 1;
      }
    }

    const otherIds = [...map.keys()];
    const users = await User.find({ _id: { $in: otherIds } }).select('name role profileImage companyName');

    const conversations = users.map((u) => ({ user: u, ...map.get(u._id.toString()) }));
    conversations.sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));

    res.json({ success: true, conversations });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/chat/:userId
// @desc    Get full conversation with a specific user
router.get('/:userId', protect, async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id }
      ]
    }).sort('createdAt');

    // Mark messages from the other user as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user._id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/chat/:userId
// @desc    Send a message (also emits over socket.io if receiver is connected)
router.post('/:userId', protect, async (req, res, next) => {
  try {
    const { text, cropId } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      receiver: req.params.userId,
      crop: cropId || undefined,
      text
    });

    const io = req.app.get('io');
    if (io) {
      io.to(req.params.userId).emit('newMessage', message);
    }

    await createNotification(
      { userId: req.params.userId, title: 'New message', message: `${req.user.name}: ${text.slice(0, 40)}`, type: 'chat', link: `/chat/${req.user._id}` },
      io
    );

    res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
