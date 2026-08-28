const express = require('express');
const Offer = require('../models/Offer');
const Crop = require('../models/Crop');
const { protect, authorize } = require('../middleware/auth');
const createNotification = require('../utils/createNotification');

const router = express.Router();

// @route   POST /api/offers
// @desc    Buyer sends a purchase offer on a crop listing
router.post('/', protect, authorize('buyer'), async (req, res, next) => {
  try {
    const { cropId, offeredPrice, offeredQuantity, message } = req.body;

    const crop = await Crop.findById(cropId);
    if (!crop || crop.status !== 'active') {
      return res.status(400).json({ success: false, message: 'This crop is not available for offers' });
    }

    const offer = await Offer.create({
      crop: crop._id,
      farmer: crop.farmer,
      buyer: req.user._id,
      offeredPrice,
      offeredQuantity,
      message
    });

    await createNotification(
      {
        userId: crop.farmer,
        title: 'New offer received',
        message: `${req.user.name} sent an offer of ₹${offeredPrice}/unit for your ${crop.cropName}`,
        type: 'offer',
        link: `/farmer/offers`
      },
      req.app.get('io')
    );

    res.status(201).json({ success: true, offer });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/offers/received
// @desc    Farmer views all offers received on their crops
router.get('/received', protect, authorize('farmer'), async (req, res, next) => {
  try {
    const offers = await Offer.find({ farmer: req.user._id })
      .populate('crop', 'cropName category quantity expectedPrice photos')
      .populate('buyer', 'name companyName buyerType phone location rating')
      .sort('-createdAt');
    res.json({ success: true, offers });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/offers/sent
// @desc    Buyer views all offers they've sent
router.get('/sent', protect, authorize('buyer'), async (req, res, next) => {
  try {
    const offers = await Offer.find({ buyer: req.user._id })
      .populate('crop', 'cropName category quantity expectedPrice photos status')
      .populate('farmer', 'name phone location rating')
      .sort('-createdAt');
    res.json({ success: true, offers });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/offers/:id/respond
// @desc    Farmer accepts or rejects an offer
router.put('/:id/respond', protect, authorize('farmer'), async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' | 'reject'
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be 'accept' or 'reject'" });
    }

    const offer = await Offer.findById(req.params.id).populate('crop');
    if (!offer) return res.status(404).json({ success: false, message: 'Offer not found' });
    if (offer.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to respond to this offer' });
    }
    if (offer.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This offer has already been responded to' });
    }

    offer.status = action === 'accept' ? 'accepted' : 'rejected';
    await offer.save();

    if (action === 'accept') {
      await Crop.findByIdAndUpdate(offer.crop._id, { status: 'sold', isSold: true });
      // Reject all other pending offers on this crop
      await Offer.updateMany(
        { crop: offer.crop._id, _id: { $ne: offer._id }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    await createNotification(
      {
        userId: offer.buyer,
        title: `Your offer was ${offer.status}`,
        message: `Your offer on ${offer.crop.cropName} was ${offer.status} by the farmer`,
        type: 'offer',
        link: `/buyer/orders`
      },
      req.app.get('io')
    );

    res.json({ success: true, offer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
