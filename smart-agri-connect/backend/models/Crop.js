const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['grain', 'vegetable', 'fruit', 'pulses', 'oilseed', 'spice', 'cash-crop', 'other'],
      required: true
    },
    quantity: { type: Number, required: true }, // in quintals
    quantityUnit: { type: String, default: 'quintal' },
    expectedPrice: { type: Number, required: true }, // per unit
    harvestDate: { type: Date, required: true },
    photos: [{ type: String }],
    description: String,
    location: {
      village: String,
      district: String,
      state: String,
      pincode: String
    },
    quality: { type: String, enum: ['A-grade', 'B-grade', 'C-grade'], default: 'A-grade' },
    organicCertified: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending-verification', 'active', 'sold', 'expired', 'rejected'],
      default: 'pending-verification'
    },
    adminNote: String,
    isSold: { type: Boolean, default: false }
  },
  { timestamps: true }
);

cropSchema.index({ cropName: 'text', 'location.district': 'text', 'location.state': 'text' });

module.exports = mongoose.model('Crop', cropSchema);
