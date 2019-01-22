const db = require('../models');

/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  // eslint-disable-next-line eqeqeq
  const product = await db.Product.findById(req.params.id);
  if (!product) return res.status(404).send('No Product found with this id');
  // eslint-disable-next-line eqeqeq
  if (req.user._id == product.author._id) next();
  else {
    res.status(401).send("Your're unauthorized.");
  }
};
