/* eslint-disable no-unused-vars */
const Joi = require('joi');
const cloudinary = require('cloudinary');
const path = require('path');
const _ = require('lodash');
const db = require('../models');

cloudinary.config({
  cloud_name: 'tahsin-cloudinary-storage',
  api_key: '653833988154654',
  api_secret: '1J3q6ijzpOxcjRQh_nlAf7-L0-w',
});

const schema = Joi.object().keys({
  title: Joi.string()
    .required()
    .min(5)
    .max(15),
  price: Joi.number().required(),
  location: Joi.string().required(),
  description: Joi.string()
    .max(255)
    .required(),
  images: Joi.array(),
});

exports.getProducts = (req, res, next) => {
  db.Product.find()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).send('Failed to retrive from database');
    });
};

exports.getSingleProduct = (req, res, next) => {
  db.Product.findById(req.params.id)
    // .populate('author')
    // .exec()
    .then((product) => {
      res.status(200).send(product);
    })
    .catch((err) => {
      res.status(404).send('Product not found.');
    });
};

// eslint-disable-next-line consistent-return
exports.editProduct = async (req, res, next) => {
  const { error, } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.message);
  const oldProduct = await db.Product.findById(req.params.id);
  if (!oldProduct) return res.status(404).send('Product Not Found');
  oldProduct.title = req.body.title;
  oldProduct.price = req.body.price;
  oldProduct.description = req.body.description;
  oldProduct.images = req.body.images;
  oldProduct.save();
  res.status(200).send(oldProduct);
};

// eslint-disable-next-line consistent-return
exports.newProduct = async (req, res, next) => {
  const { error, } = Joi.validate(req.body, schema);
  if (error) return res.status(400).send(error.message);
  // eslint-disable-next-line no-underscore-dangle
  const author = await db.User.findById(req.user._id);
  if (!author) {
    const err = new Error();
    err.status = 400;
    err.message = 'User not found.';
    return next(err);
  }
  const newProduct = req.body;
  newProduct.author = author;
  db.Product.create(newProduct)
    .then((result) => {
      author.products.push(result);
      author.save();
      res.status(201).send(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Failed to save on database');
    });
};
