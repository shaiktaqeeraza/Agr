const Notification = require('../models/Notification');

// Call this helper anywhere (offers, orders, chat, admin actions) to notify a user.
// io is the socket.io instance (optional) so we can push it live if the user is connected.
const createNotification = async ({ userId, title, message, type = 'system', link = '' }, io = null) => {
  const notification = await Notification.create({ user: userId, title, message, type, link });
  if (io) {
    io.to(userId.toString()).emit('notification', notification);
  }
  return notification;
};

module.exports = createNotification;
