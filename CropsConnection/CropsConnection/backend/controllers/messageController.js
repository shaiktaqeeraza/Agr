const Message = require('../models/Message');
const Notification = require('../models/Notification');

exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: userId },
        { senderId: userId, receiverId: req.user.id }
      ]
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getConversationsList = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
    }).sort({ timestamp: -1 }).populate('senderId receiverId', 'name profileImage location');

    const seen = new Set();
    const conversations = [];
    for (const m of messages) {
      const otherUser = m.senderId._id.toString() === req.user.id ? m.receiverId : m.senderId;
      const key = otherUser._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        conversations.push({ user: otherUser, lastMessage: m.message, timestamp: m.timestamp });
      }
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    if (!receiverId || !message) {
      return res.status(400).json({ message: 'receiverId and message are required' });
    }

    const newMessage = await Message.create({
      senderId: req.user.id,
      receiverId,
      message
    });

    await Notification.create({
      userId: receiverId,
      type: 'message',
      message: 'You have a new message',
      fromUserId: req.user.id
    });

    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('receiveMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
