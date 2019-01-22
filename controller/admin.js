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
  profilePhoto: Joi.string().required(),
  location: Joi.string().required(),
  gender: Joi.string().required(),
});

const loginUserSchema = Joi.object().keys({
  userName: Joi.string()
    .min(3)
    .required(),
  password: Joi.string()
    .min(6)
    .required(),
});
// eslint-disable-next-line consistent-return
module.exports.registerUser = async (req, res, next) => {
  // console.log(req.body);
  // // const err = new Error();
  // // err.status = 409;
  // res.status(404).send('Ca');
  const { error, } = Joi.validate(req.body, regUserSchema);
  if (error) return next(new errors.BadRequest({ errorMessage: 'Invalid Input. Please try again.', }));
  let user = await db.User.findOne({
    $or: [{ userName: req.body.userName, }, { email: req.body.email, }],
  });
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

// eslint-disable-next-line consistent-return
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

module.exports.authenticateUser = (req, res, next) => {
  const token = req.header('x-auth-token');
  const valid = jwt.verify(token, 'Secret');
  if (valid) {
    // eslint-disable-next-line no-underscore-dangle
    db.User.findById(valid._id)
      .then((user) => {
        res.status(200).json(user.toAdminJSON());
      })
      .catch(() => {
        res.send(new errors.NotFound({ errorMessage: 'User not found', }));
      });
  }
  else {
    console.log('JWT Failed');
  }
};
