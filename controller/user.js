/* eslint-disable eqeqeq */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
const db = require('../models');

// exports.getUser = async (req, res, next) => {
//   let role;
//   db.User.findById(req.params.id)
//     .then((user) => {
//       req.user._id == user._id ? (role = 'admin') : (role = 'user');
//       if (role === 'admin') return res.status(200).send(user.toAdminJSON());
//       return res.status(200).send(user.toUserJSON());
//     })
//     .catch(err => res.status(404).send('No user found with given id'));
// };
exports.getUser = async (req, res, next) => {
  let role;
  db.User.findById(req.params.id)
    .populate('products')
    .exec()
    .then((user) => {
      req.user._id == user._id ? (role = 'admin') : (role = 'user');
      if (role === 'admin') return res.status(200).send(user.toAdminJSON());
      return res.status(200).send(user.toUserJSON());
    })
    .catch(err => res.status(404).send('No user found with given id'));
};

// exports.getUserProducts = async (req, res, next) => {
//   db.User
// }
