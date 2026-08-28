const Post = require('../models/Post');
const User = require('../models/User');
const Follower = require('../models/Follower');
const Notification = require('../models/Notification');

exports.getPosts = async (req, res) => {
  try {
    const { search } = req.query;
    let match = {};
    if (search) {
      match = {
        $or: [
          { cropName: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const posts = await Post.find(match)
      .sort({ createdAt: -1 })
      .populate('userId', 'name location profileImage');

    let followingIds = [];
    if (req.user) {
      const follows = await Follower.find({ followerId: req.user.id });
      followingIds = follows.map(f => f.followingId.toString());
    }

    const result = posts.map(p => ({
      ...p.toObject(),
      isFollowing: followingIds.includes(p.userId?._id?.toString())
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { cropName, pricePerKg, quantity, negotiable, location } = req.body;
    if (!cropName || !pricePerKg || !quantity) {
      return res.status(400).json({ message: 'cropName, pricePerKg and quantity are required' });
    }

    const post = await Post.create({
      userId: req.user.id,
      cropName,
      cropImage: req.file ? `/uploads/${req.file.filename}` : '',
      pricePerKg,
      quantity,
      negotiable: negotiable === 'false' ? false : true,
      location: location || ''
    });

    const populated = await post.populate('userId', 'name location profileImage');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { cropName, pricePerKg, quantity, negotiable, sold, location } = req.body;
    if (cropName !== undefined) post.cropName = cropName;
    if (pricePerKg !== undefined) post.pricePerKg = pricePerKg;
    if (quantity !== undefined) post.quantity = quantity;
    if (negotiable !== undefined) post.negotiable = negotiable;
    if (sold !== undefined) post.sold = sold;
    if (location !== undefined) post.location = location;
    if (req.file) post.cropImage = `/uploads/${req.file.filename}`;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
