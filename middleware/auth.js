const jwt = require('jsonwebtoken');
const db = require('../models');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('No token provided');
  try {
    const decoded = jwt.verify(token, 'Secret');
    // eslint-disable-next-line no-underscore-dangle
    db.User.findById(decoded._id)
      // eslint-disable-next-line consistent-return
      .then((user) => {
        if (!user) {
          return res.status(401).send("Your token is not valid anymore as user doesn't exist.");
        }
        // eslint-disable-next-line no-underscore-dangle
        req.user = {
          // eslint-disable-next-line no-underscore-dangle
          _id: decoded._id,
          fullName: decoded.fullName,
        };
        next();
      })
      .catch(() => res.status(500).send('Failed to verify user'));
  }
  catch (error) {
    res.status(400).send('Invalid Token');
  }
};
