const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['user', 'product'], required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
