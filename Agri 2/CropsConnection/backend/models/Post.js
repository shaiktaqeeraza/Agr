const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropName: { type: String, required: true },
  cropImage: { type: String, default: '' },
  pricePerKg: { type: Number, required: true },
  quantity: { type: Number, required: true },
  negotiable: { type: Boolean, default: true },
  sold: { type: Boolean, default: false },
  location: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
