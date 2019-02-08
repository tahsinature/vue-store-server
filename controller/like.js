const Joi = require('joi');
const db = require('../models/index');

module.exports.likeToggle = async (req, res, next) => {
  const { productId, } = req.body;
  const { likerId, } = req.body;

  const product = await db.Product.findById(productId);
  const isAlreadyLiked = product.likers.includes(likerId);
  if (!isAlreadyLiked) {
    product.likes += 1;
    product.likers.push(likerId);
    product.save();
    res.status(200).send('Liked');
    require('../helper/notify').notifyUser(product.author, likerId, productId, 'like', undefined);
  }
  else {
    product.likes -= 1;
    product.likers.pop(likerId);
    product.save();
    res.status(200).send('Disliked');
  }
};
