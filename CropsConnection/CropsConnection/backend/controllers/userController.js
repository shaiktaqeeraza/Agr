const User = require('../models/User');
const Post = require('../models/Post');
const Follower = require('../models/Follower');

exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const postsCount = await Post.countDocuments({ userId: user._id });
    const followingCount = await Follower.countDocuments({ followerId: user._id });
    const followersCount = await Follower.countDocuments({ followingId: user._id });
    const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });

    res.json({ user, postsCount, followingCount, followersCount, posts });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, location, bio } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (location) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (req.file) updateData.profileImage = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
