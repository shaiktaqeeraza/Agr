const express = require('express');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Offer = require('../models/Offer');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get logged-in user's full profile (farmer or buyer)
router.get('/profile', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/users/profile
// @desc    Update profile - location, farm details, company info, etc.
router.put('/profile', protect, async (req, res, next) => {
  try {
    const allowedFields = [
      'name', 'location', 'farmDetails', 'companyName', 'gstNumber',
      'buyerType', 'preferredLanguage'
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/users/profile/photo
// @desc    Upload/update profile photo
router.put('/profile/photo', protect, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No photo uploaded' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: `/uploads/${req.file.filename}` },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/users/:id
// @desc    Public profile view (e.g. buyer viewing farmer's profile, includes rating)
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select(
      'name role location farmDetails companyName rating ratingCount profileImage createdAt'
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/users/farmer/history
// @desc    Farmer's crop selling history (sold crops + accepted offers)
router.get('/farmer/history', protect, async (req, res, next) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ success: false, message: 'Only farmers can access selling history' });
    }
    const soldCrops = await Crop.find({ farmer: req.user._id, status: 'sold' }).sort('-updatedAt');
    const acceptedOffers = await Offer.find({ farmer: req.user._id, status: 'accepted' })
      .populate('crop', 'cropName category')
      .populate('buyer', 'name companyName phone')
      .sort('-updatedAt');

    res.json({ success: true, soldCrops, acceptedOffers });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
