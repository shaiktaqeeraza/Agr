const express = require('express');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/products
// @desc    List/search agri-store products (seeds, fertilizers, pesticides, tools)
router.get('/', async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).sort('-createdAt').skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/products/:id
router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/products
// @desc    Admin adds a new product
router.post('/', protect, authorize('admin'), upload.array('images', 5), async (req, res, next) => {
  try {
    const { name, category, brand, description, price, unit, stock } = req.body;
    const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const product = await Product.create({
      name, category, brand, description, price, unit, stock,
      images, createdBy: req.user._id
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/products/:id
// @desc    Admin updates a product
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const fields = ['name', 'category', 'brand', 'description', 'price', 'unit', 'stock', 'isActive'];
    const updates = {};
    fields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/products/:id
// @desc    Admin deletes/deactivates a product
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
