// const Joi = require('joi');
const db = require('../models/index');

module.exports.getNotifications = async (req, res, next) => {
  const { notifications, } = await db.User.findById(req.user._id).sort({ createdAt: -1, }).select(['notifications', '-_id'])
    .populate('notifications.user', ['fullName', 'profilePhoto.url'])
    .populate('notifications.product', ['title'])
    .exec();
  res.status(200).send(notifications);
};

module.exports.markAsRead = async (req, res, next) => {
  const ids = req.body.notificationIds;
  const user = await db.User.findById(req.user._id);
  const notifications = user.notifications;
  ids.forEach((id) => {
    notifications.find(ele => ele._id == id).isRead = true;
  });
  user.save();
  res.status(200).send(ids);
};

module.exports.deleteNotifications = async (req, res, next) => {
  const ids = req.body.notificationIds;
  const user = await db.User.findById(req.user._id);
  const notifications = user.notifications;
  ids.forEach((id) => {
    notifications.splice(notifications.indexOf(notifications.find(ele => ele._id == id)), 1);
  });
  user.save();
  res.status(200).send(ids);
};
