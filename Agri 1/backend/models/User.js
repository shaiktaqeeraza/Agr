const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'admin'],
      default: 'farmer',
      required: true
    },
    // Buyer sub-type: trader, company, individual (only relevant when role === 'buyer')
    buyerType: { type: String, enum: ['trader', 'company', 'individual'], default: 'individual' },

    // Location fields, used by both farmers & buyers for search/filter
    location: {
      village: String,
      district: String,
      state: String,
      pincode: String,
      lat: Number,
      lng: Number
    },

    // Farmer-specific profile
    farmDetails: {
      farmSize: Number, // in acres
      farmSizeUnit: { type: String, default: 'acre' },
      soilType: String,
      irrigationType: String,
      primaryCrops: [String]
    },

    // Buyer/company specific
    companyName: String,
    gstNumber: String,

    profileImage: { type: String, default: '' },
    preferredLanguage: { type: String, default: 'en' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
