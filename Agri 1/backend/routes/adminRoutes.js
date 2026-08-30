const express = require('express');
const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Offer = require('../models/Offer');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    High-level analytics for the admin dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const [farmerCount, buyerCount, cropCount, pendingCrops, orderCount, productCount, offerCount, totalSalesAgg] =
      await Promise.all([
        User.countDocuments({ role: 'farmer' }),
        User.countDocuments({ role: 'buyer' }),
        Crop.countDocuments(),
        Crop.countDocuments({ status: 'pending-verification' }),
        Order.countDocuments(),
        Product.countDocuments(),
        Offer.countDocuments(),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ])
      ]);

    res.json({
      success: true,
      stats: {
        farmerCount,
        buyerCount,
        cropCount,
        pendingCrops,
        orderCount,
        productCount,
        offerCount,
        totalSales: totalSalesAgg[0]?.total || 0
      }
    });
  } catch (err) {
    next(err);
  }
});

// ---- Manage Farmers & Buyers ----
// @route   GET /api/admin/users?role=farmer|buyer
router.get('/users', async (req, res, next) => {
  try {
    const query = {};
    if (req.query.role) query.role = req.query.role;
    const users = await User.find(query).sort('-createdAt');
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/admin/users/:id/block
router.put('/users/:id/block', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/admin/users/:id/unblock
router.put('/users/:id/unblock', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/admin/users/:id/verify
router.put('/users/:id/verify', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// ---- Verify Crop Listings ----
// @route   GET /api/admin/crops?status=pending-verification
router.get('/crops', async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) query.status = req.query.status;
    const crops = await Crop.find(query).populate('farmer', 'name phone location').sort('-createdAt');
    res.json({ success: true, crops });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/admin/crops/:id/verify
router.put('/crops/:id/verify', async (req, res, next) => {
  try {
    const { action, note } = req.body; // action: 'approve' | 'reject'
    const status = action === 'approve' ? 'active' : 'rejected';
    const crop = await Crop.findByIdAndUpdate(req.params.id, { status, adminNote: note }, { new: true });
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, crop });
  } catch (err) {
    next(err);
  }
});

// ---- Transactions & Analytics ----
// @route   GET /api/admin/orders
router.get('/orders', async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name phone role').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/admin/offers
router.get('/offers', async (req, res, next) => {
  try {
    const offers = await Offer.find()
      .populate('crop', 'cropName')
      .populate('farmer', 'name')
      .populate('buyer', 'name')
      .sort('-createdAt');
    res.json({ success: true, offers });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
