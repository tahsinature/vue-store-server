const db = require('../models');

module.exports = async (req, res, next) => {
  const product = await db.Product.findById(req.params.id);
  if (!product) return res.status(404).send('No Product found with this id');
  if (req.user._id == product.author._id) next();
  else {
    res.status(401).send("Your're unauthorized.");
  }
};
