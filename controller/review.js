const Joi = require('joi');
const db = require('../models/index');

const reviewSchema = Joi.object().keys({
  text: Joi.string()
    .max(255)
    .required(),
  productId: Joi.string().required(),
});

module.exports.makeReview = async (req, res, next) => {
  const { error, } = Joi.validate(req.body, reviewSchema);
  if (error) return res.status(400).send(error.message);
  const author = await db.User.findById(req.user._id);
  if (!author) {
    const err = new Error();
    err.status = 400;
    err.message = 'User not found.';
    return next(err);
  }
  const product = await db.Product.findById(req.body.productId);
  if (!product) {
    const err = new Error();
    err.status = 404;
    err.message = 'Product not found.';
    return next(err);
  }
  const newReview = { text: req.body.text, };
  // newReview.author = _.pick(author, ['_id', 'fullName']);
  newReview.author = req.user;
  newReview.product = product;
  db.Review.create(newReview)
    .then((result) => {
      product.reviews.unshift(result);
      product.save();
      res.status(201).send(result);
      require('../helper/notify').notifyUser(product.author, req.user._id, product._id, 'review', result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Failed to save review on database');
    });
};

module.exports.likeToggleReview = async (req, res, next) => {
  const user = await db.User.findById(req.user._id).select('_id');
  const review = await db.Review.findById(req.params.id);
  let foundIndex;
  if (user._id == review.author._id) return res.status(400).send('You cannot like your own review');
  const isAlreadyLiked = review.likers.find((ele, index) => {
    foundIndex = index;
    return ele.equals(user._id);
  });
  if (isAlreadyLiked) {
    review.likers.splice(foundIndex, 1);
    review.likes -= 1;
    review.save();
    res.status(200).send(review);
    return require('../helper/notify').notifyUser(review.author._id, user._id, review.product, 'review-unlike', review);
  }
  review.likers.unshift(user._id);
  review.likes += 1;
  review.save();
  res.status(200).send(review);
  require('../helper/notify').notifyUser(review.author._id, user._id, review.product, 'review-like', review);
};

module.exports.removeReview = async (req, res, next) => {
  const author = await db.User.findById(req.user._id);
  const review = await db.Review.findById(req.params.id);
  const product = await db.Review.findById(review.product);
  const isAuthor = author._id == review.author._id;
  if (!review) return res.status(404).send('Review not found');
  if (!isAuthor) return res.status(401).send('You are not the author of this review');
  db.Review.findOneAndRemove({ _id: review._id, }).then((result) => {
    db.Product.findOneAndUpdate({ reviews: result._id, }, { $pull: { reviews: result._id, }, }).then(x => res.send(x));
  });
};
