const mongoose = require('mongoose');
// const Joi = require('joi');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 25,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          // required: true,
        },
      }
    ],
    likes: {
      type: Number,
      default: 0,
    },
    likers: [
      {
        type: String,
      }
    ],
    location: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    isSold: {
      type: Boolean,
      default: false,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      }
    ],
  },
  { timestamps: true, }
);

module.exports = mongoose.model('Product', productSchema);
