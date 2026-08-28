const mongoose = require('mongoose');

// Crop Advisory: farmer questions, answered by admin/expert
const questionSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['disease', 'pest', 'soil', 'irrigation', 'weather', 'other'], default: 'other' },
    photos: [String],
    answer: String,
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['open', 'answered'], default: 'open' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
