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
    likers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }
    ],
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    author: {
      _id: String,
      fullName: String,
    },
  },
  { timestamps: true, }
);

module.exports = mongoose.model('Review', reviewSchema);
