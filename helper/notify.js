const db = require('../models/');
const io = require('../socket').getIO();

// admin
// user
// product
// type -> like/review-like/review-unlike/review/friend/soldProduct/newProduct
// text

async function notifyUser(adminId, userId, productId, type, createdPackage) {
  const admin = await db.User.findById(adminId);
  const user = await db.User.findById(userId).select(['fullName', 'profilePhoto.url']);
  const product = await db.Product.findById(productId).select('title');
  const notificationType = type;
  const notification = {
    product,
    user,
    notificationType,
  };
  admin.notifications.unshift(notification);
  admin.save();
  io.emit('newNotification', admin.notifications[0], adminId, createdPackage);
}

// async function brodcastUser(adminId, userId, productId, type, createdPackage) {
//   const admin = await db.User.findById(adminId);
//   const user = await db.User.findById(userId).select(['fullName', 'profilePhoto.url']);
//   const product = await db.Product.findById(productId).select('title');
//   const notificationType = type;
//   const notification = {
//     product,
//     user,
//     notificationType,
//   };
//   admin.notifications.unshift(notification);
//   admin.save();
//   io.broadcast.emit('newNotification', admin.notifications[0], adminId, createdPackage);
// }

module.exports.notifyUser = notifyUser;
// module.exports.brodcastUser = brodcastUser;
