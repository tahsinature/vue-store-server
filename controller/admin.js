const Joi = require('joi');
const errors = require('throw.js');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const db = require('../models/index');

const regUserSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  userName: Joi.string()
    .min(3)
    .required(),
  email: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .required(),
  contactNo: Joi.string().required(),
  profilePhoto: Joi.object().required(),
  location: Joi.string().required(),
  address: Joi.string().max(100).required(),
  gender: Joi.string().required(),
  bio: Joi.string()
    .max(255)
    .required(),
});


const editUserSchema = Joi.object().keys({
  fullName: Joi.string().required(),
  // userName: Joi.string()
  //   .min(3)
  //   .required(),
  // email: Joi.string().required(),
  // password: Joi.string()
  //   .min(6)
  //   .required(),
  contactNo: Joi.string().required(),
  profilePhoto: Joi.object().required(),
  location: Joi.string().required(),
  address: Joi.string().max(100).required(),
  gender: Joi.string().required(),
  bio: Joi.string()
    .max(255)
    .required(),
});

const loginUserSchema = Joi.object().keys({
  userName: Joi.string()
    .min(3)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});

module.exports.checkAvailablity = async (req, res, next) => {
  const userName = req.query.userName;
  const email = req.query.email;
  if (userName && email) return res.status(400).send('Bad Request');
  if (!userName && !email) return res.status(400).send('Bad Request');
  if (userName) {
    db.User.findOne({
      userName,
    }).then((result) => {
      if (result) return res.status(409).send('Username already taken');
      return res.status(200).send('Username available');
    });
  }
  if (email) {
    db.User.findOne({
      email,
    }).then((result) => {
      if (result) return res.status(409).send('This email is already registered');
      return res.status(200).send('Email is OK');
    });
  }
};

module.exports.registerUser = async (req, res, next) => {
  const { error, } = Joi.validate(req.body, regUserSchema);
  if (error) return res.status(400).send(error.message);
  let user = await db.User.findOne({
    $or: [{ userName: req.body.userName, }, { email: req.body.email, }],
  });
  console.log(user);
  if (user) {
    return next(
      new errors.Conflict({ errorMessage: 'User already registerd with this e-Mail or, username.', })
    );
  }
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);
  const newUserData = _.omit(req.body, 'password');
  newUserData.password = hashed;
  user = new db.User(newUserData);
  user.save();
  res.status(201).json({ message: 'Successfully Registered.', });
};

module.exports.loginUser = async (req, res, next) => {
  const credential = _.pick(req.body, ['userName', 'password']);
  const { error, } = Joi.validate(credential, loginUserSchema);
  if (error) {
    return next(new errors.BadRequest({ errorMessage: 'Invalid Input', }));
  }
  const user = await db.User.findOne({ userName: req.body.userName, });
  // console.log('dbug', user);
  if (!user) return next(new errors.BadRequest({ errorMessage: 'No user matches with this credentials.', }));
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return next(new errors.Unauthorized({ errorMessage: 'Invalid credentials.', }));
  }
  const token = user.generateToken();
  res.status(200).send({ 'x-auth-token': token, user: user.toAdminJSON(), });
};


module.exports.editUser = async (req, res, next) => {
  const { error, } = Joi.validate(req.body, editUserSchema);
  if (error) {
    return next(new errors.BadRequest({ errorMessage: 'Invalid Input', }));
  }
  db.User.findOneAndUpdate({ _id: req.user._id, }, req.body).then((result) => {
    console.log(result);
    res.status(200).send(result.toAdminJSON());
  });
  // if (!isValidPassword) {
  //   return next(new errors.Unauthorized({ errorMessage: 'Invalid credentials.', }));
  // }
};


module.exports.authenticateUser = (req, res, next) => {
  const token = req.header('x-auth-token');
  const valid = jwt.verify(token, 'Secret');
  if (valid) {
    db.User.findById(valid._id)
      .then((user) => {
        require('../status')(user._id);
        res.status(200).json(user.toAdminJSON());
      })
      .catch(() => {
        res.status(404).send('User Not Found');
      });
  }
  else {
    console.log('JWT Failed');
  }
};

module.exports.getUser = async (req, res, next) => {
  let role;
  db.User.findById(req.params.id)
    .populate('products')
    .populate({
      path: 'contacts',
      select: ['fullName', 'profilePhoto', 'products', 'isOnline'],
      populate: {
        path: 'products',
        match: { isSold: false, },
        select: '_id',
      },
    })
    .exec()
    .then((user) => {
      req.user._id == user._id ? (role = 'admin') : (role = 'user');
      if (role === 'admin') return res.status(200).send(user.toAdminJSON());
      return res.status(200).send(user.toUserJSON());
    })
    .catch(err => res.status(404).send('No user found with given id'));
};
