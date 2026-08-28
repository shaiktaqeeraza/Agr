const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const createNotification = require('../utils/createNotification');

const router = express.Router();

// @route   POST /api/orders
// @desc    Place an order from the current cart (agri-store products)
router.post('/', protect, async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    // Validate stock and build order items
    const items = [];
    let totalAmount = 0;
    for (const item of cart.items) {
      if (!item.product || item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product ? item.product.name : 'a product'}`
        });
      }
      items.push({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      });
      totalAmount += item.product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod
    });

    // Decrease stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    await createNotification(
      {
        userId: req.user._id,
        title: 'Order placed successfully',
        message: `Your order of ₹${totalAmount} has been placed`,
        type: 'order',
        link: '/orders'
      },
      req.app.get('io')
    );

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/orders/mine
router.get('/mine', protect, async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/orders/:id
router.get('/:id', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/orders/:id/cancel
router.put('/:id/cancel', protect, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    if (['shipped', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order already shipped, cannot cancel' });
    }
    order.orderStatus = 'cancelled';
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Admin updates order status (confirmed/shipped/delivered)
router.put('/:id/status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    await createNotification(
      {
        userId: order.user,
        title: 'Order status updated',
        message: `Your order is now: ${order.orderStatus}`,
        type: 'order',
        link: '/orders'
      },
      req.app.get('io')
    );

    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
