const mongoose = require('mongoose');

// Handles Agri-Store product orders placed by farmers/buyers
const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        quantity: Number,
        price: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    shippingAddress: {
      village: String,
      district: String,
      state: String,
      pincode: String,
      phone: String
    },
    paymentMethod: { type: String, enum: ['cod', 'online'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
