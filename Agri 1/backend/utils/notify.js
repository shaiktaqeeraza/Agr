const Notification = require("../models/Notification");

// io is the socket.io instance attached to app in server.js
const sendNotification = async (io, { userId, title, message, type = "general", link = "" }) => {
  const notification = await Notification.create({ user: userId, title, message, type, link });
  if (io) {
    io.to(`user_${userId}`).emit("notification", notification);
  }
  return notification;
};

module.exports = sendNotification;
