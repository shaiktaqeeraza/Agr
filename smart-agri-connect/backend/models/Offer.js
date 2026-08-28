const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    crop: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredPrice: { type: Number, required: true },
    offeredQuantity: { type: Number, required: true },
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Offer', offerSchema);
