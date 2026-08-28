const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    isExpert: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const advisorySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["question", "tip", "disease_pest"],
      default: "question",
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    cropCategory: { type: String, default: "Other" },
    images: [{ type: String }],
    tags: [{ type: String }],
    replies: [replySchema],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Advisory", advisorySchema);
