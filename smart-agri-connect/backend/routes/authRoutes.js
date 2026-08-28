const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

// @route   POST /api/auth/register
// @desc    Register a farmer, buyer, or (rarely) admin
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').isLength({ min: 10 }).withMessage('Valid phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['farmer', 'buyer', 'admin']).withMessage('Invalid role')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, phone, password, role, buyerType, location, farmDetails, companyName, gstNumber } = req.body;

      const existing = await User.findOne({ $or: [{ email }, { phone }] });
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
      }

      const user = await User.create({
        name, email, phone, password, role,
        buyerType, location, farmDetails, companyName, gstNumber
      });

      const token = generateToken(user._id, user.role);
      res.status(201).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).select('+password');

      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      if (user.isBlocked) {
        return res.status(403).json({ success: false, message: 'Your account has been blocked by admin' });
      }

      const token = generateToken(user._id, user.role);
      res.json({
        success: true,
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
      });
    } catch (err) {
      next(err);
    }
  }
);

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
