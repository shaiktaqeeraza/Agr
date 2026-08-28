const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['seed', 'fertilizer', 'pesticide', 'tool', 'equipment', 'other'],
      required: true
    },
    brand: String,
    description: String,
    price: { type: Number, required: true },
    unit: { type: String, default: 'piece' }, // kg, litre, piece, etc.
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin who added it
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
