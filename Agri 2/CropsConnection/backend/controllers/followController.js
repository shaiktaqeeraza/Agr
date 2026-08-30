const Follower = require('../models/Follower');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.toggleFollow = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const existing = await Follower.findOne({ followerId: req.user.id, followingId: userId });

    if (existing) {
      await existing.deleteOne();
      return res.json({ following: false });
    }

    await Follower.create({ followerId: req.user.id, followingId: userId });

    await Notification.create({
      userId,
      type: 'follow',
      message: 'started following you',
      fromUserId: req.user.id
    });

    res.json({ following: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  try {
    const follows = await Follower.find({ followerId: req.user.id }).populate('followingId', 'name location profileImage');
    const following = follows.map(f => f.followingId);
    res.json(following);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
