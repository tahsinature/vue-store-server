/* eslint-disable func-names */
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      minlength: 3,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    contactNo: {
      type: String,
      required: true,
    },
    profilePhoto: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        // required: true,
      },
    },
    bio: {
      type: String,
      required: true,
      maxlength: 255,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      maxlength: 100,
    },
    gender: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
        },
      }
    ],
    contacts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    chats: [
      {
        partner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        messages: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
          }
        ],
      }
    ],
    isOnline: {
      type: Boolean,
      default: true,
    },
    notifications: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        notificationType: {
          type: String,
          require: true,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
        isRead: {
          type: Boolean,
          default: false,
        },
      }
    ],
  },
  { timestamps: true, }
);
userSchema.method('generateToken', function () {
  const token = jwt.sign(_.pick(this, ['_id', 'fullName']), 'Secret');
  return token;
});
userSchema.method('toAdminJSON', function () {
  const cloned = this.toObject();
  delete cloned.password;
  return cloned;
});
userSchema.method('toUserJSON', function () {
  const cloned = this.toObject();
  delete cloned.userName;
  delete cloned.email;
  delete cloned.password;
  delete cloned.contacts;
  return cloned;
});

module.exports = mongoose.model('User', userSchema);
