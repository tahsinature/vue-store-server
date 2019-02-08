const db = require('../models');

module.exports = async (req, res, next) => {
  const product = await db.Product.findById(req.body.productId);
  if (!product) return res.status(404).send('No product found to make review on.');
  const isAuthor = product.author == req.user._id;
  if (isAuthor) return res.status(400).send("You can't apply review, like, whitelisting to your own product.");
  next();
};
