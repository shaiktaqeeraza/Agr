const express = require('express');
const Crop = require('../models/Crop');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/crops
// @desc    Farmer uploads a new crop listing (with up to 5 photos)
router.post('/', protect, authorize('farmer'), upload.array('photos', 5), async (req, res, next) => {
  try {
    const { cropName, category, quantity, expectedPrice, harvestDate, description, quality, organicCertified, location } = req.body;

    const photos = (req.files || []).map((f) => `/uploads/${f.filename}`);

    const crop = await Crop.create({
      farmer: req.user._id,
      cropName,
      category,
      quantity,
      expectedPrice,
      harvestDate,
      description,
      quality,
      organicCertified: organicCertified === 'true' || organicCertified === true,
      photos,
      location: location ? JSON.parse(location) : req.user.location,
      status: 'pending-verification'
    });

    res.status(201).json({ success: true, crop });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/crops
// @desc    Browse/search all ACTIVE crops - filters: location(district/state), minPrice, maxPrice, minQuantity, category, search
router.get('/', async (req, res, next) => {
  try {
    const { search, district, state, category, minPrice, maxPrice, minQuantity, page = 1, limit = 12 } = req.query;

    const query = { status: 'active', isSold: false };

    if (search) query.$text = { $search: search };
    if (district) query['location.district'] = new RegExp(district, 'i');
    if (state) query['location.state'] = new RegExp(state, 'i');
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.expectedPrice = {};
      if (minPrice) query.expectedPrice.$gte = Number(minPrice);
      if (maxPrice) query.expectedPrice.$lte = Number(maxPrice);
    }
    if (minQuantity) query.quantity = { $gte: Number(minQuantity) };

    const skip = (Number(page) - 1) * Number(limit);

    const [crops, total] = await Promise.all([
      Crop.find(query)
        .populate('farmer', 'name location profileImage rating ratingCount phone')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Crop.countDocuments(query)
    ]);

    res.json({ success: true, crops, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/crops/mine
// @desc    Farmer views their own listings (all statuses)
router.get('/mine', protect, authorize('farmer'), async (req, res, next) => {
  try {
    const crops = await Crop.find({ farmer: req.user._id }).sort('-createdAt');
    res.json({ success: true, crops });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/crops/:id
router.get('/:id', async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmer', 'name location profileImage rating ratingCount phone');
    if (!crop) return res.status(404).json({ success: false, message: 'Crop listing not found' });
    res.json({ success: true, crop });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/crops/:id
// @desc    Farmer edits their own crop listing (goes back to pending-verification)
router.put('/:id', protect, authorize('farmer'), async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop listing not found' });
    if (crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const fields = ['cropName', 'category', 'quantity', 'expectedPrice', 'harvestDate', 'description', 'quality', 'organicCertified'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) crop[f] = req.body[f];
    });
    crop.status = 'pending-verification'; // re-verify after edits

    await crop.save();
    res.json({ success: true, crop });
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/crops/:id
router.delete('/:id', protect, authorize('farmer'), async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop listing not found' });
    if (crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }
    await crop.deleteOne();
    res.json({ success: true, message: 'Crop listing deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
