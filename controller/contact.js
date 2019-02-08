const Joi = require('joi');
const db = require('../models/index');

module.exports.getContacts = async (req, res, next) => {
  const user = await db.User.findById(req.user._id).populate('contacts', ['fullName', 'profilePhoto']).exec();
  res.send(user.contacts);
};

module.exports.contactToggle = async (req, res, next) => {
  const { contactId, } = req.body;
  const userId = req.user._id;

  const contact = await db.User.findById(contactId);
  const user = await db.User.findById(userId);

  let foundIndex;
  const isAlreadyFriend = user.contacts.find((x, index) => {
    foundIndex = index;
    return x.equals(contactId);
  });
  if (!isAlreadyFriend) {
    user.contacts.unshift(contact);
    user.save();
    res.status(200).send('add');
    require('../helper/notify').notifyUser(contactId, userId, undefined, 'friend', undefined);
  }
  else {
    const removed = user.contacts.splice(foundIndex, 1);
    user.save();
    res.status(200).send('remove');
  }
};
