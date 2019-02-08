const db = require('../models/index');

module.exports.getCart = async (req, res, next) => {
  const user = await db.User.findById(req.user._id).populate('cart.product', ['title', 'price']).exec();
  res.status(200).send(user.cart);
};

module.exports.saveCart = async (req, res, next) => {
  const { cartItems, } = req.body;
  const user = await db.User.findById(req.user._id);
  await user.update({ $set: { cart: [], }, });
  if (cartItems.length === 0) {
    return res.status(200).send('Cart has been empty.');
  }
  cartItems.forEach(async (cartItem) => {
    const product = await db.Product.findById(cartItem._id);
    const newCartItem = {
      product,
      quantity: cartItem.quantity,
    };
    user.cart.unshift(newCartItem);
    if (user.cart.length === cartItems.length) {
      user.save();
      res.status(200).send(user.cart);
    }
  });
};
