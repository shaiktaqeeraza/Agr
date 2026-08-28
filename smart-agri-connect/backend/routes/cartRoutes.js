const express = require('express');
const Cart = require('../models/Cart');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/cart
router.get('/', protect, async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/cart
// @desc    Add item to cart (or increase quantity if already present)
router.post('/', protect, async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const existingItem = cart.items.find((i) => i.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/cart/:productId
// @desc    Update quantity of a specific item
router.put('/:productId', protect, async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not in cart' });

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/cart/:productId
router.delete('/:productId', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
router.delete('/', protect, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
