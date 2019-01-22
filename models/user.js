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
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      require: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
  return cloned;
});

module.exports = mongoose.model('User', userSchema);
