const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Leave a review/rating for a user (farmer/buyer) or a product
router.post('/', protect, async (req, res, next) => {
  try {
    const { targetType, targetId, rating, comment } = req.body;

    const review = await Review.create({
      reviewer: req.user._id,
      targetType,
      targetUser: targetType === 'user' ? targetId : undefined,
      targetProduct: targetType === 'product' ? targetId : undefined,
      rating,
      comment
    });

    // Recalculate average rating
    if (targetType === 'user') {
      const reviews = await Review.find({ targetUser: targetId });
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await User.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), ratingCount: reviews.length });
    } else {
      const reviews = await Review.find({ targetProduct: targetId });
      const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(targetId, { rating: avg.toFixed(1), ratingCount: reviews.length });
    }

    res.status(201).json({ success: true, review });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reviews/user/:id
router.get('/user/:id', async (req, res, next) => {
  try {
    const reviews = await Review.find({ targetUser: req.params.id }).populate('reviewer', 'name profileImage');
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/reviews/product/:id
router.get('/product/:id', async (req, res, next) => {
  try {
    const reviews = await Review.find({ targetProduct: req.params.id }).populate('reviewer', 'name profileImage');
    res.json({ success: true, reviews });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
