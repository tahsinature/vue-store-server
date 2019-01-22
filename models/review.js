const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      maxlength: 255,
    },
    likes: {
      type: Number,
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, }
);

module.exports = mongoose.model('Review', reviewSchema);
