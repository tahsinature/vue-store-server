const db = require('./models');
const io = require('./socket').getIO();

const loggedInUser = [];

const makeUserOfflineFromDB = (id) => {
  io.emit('userOnline', id);
  const token = setTimeout(() => {
    let foundIndex;
    const userId = loggedInUser.find((ele, index) => {
      foundIndex = index;
      return ele == id;
    });
    if (userId) {
      loggedInUser.splice(foundIndex, 1);
    }
    db.User.findById(id).then((user) => {
      user.isOnline = false;
      user.save();
    });
    io.emit('userOffline', id);
  }, 60000);
  const ticket = {
    id,
    token,
  };
  loggedInUser.push(ticket);
};

const makeUserOnlineFromDB = (id) => {
  db.User.findById(id).then((user) => {
    user.isOnline = true;
    user.save();
  });
};


module.exports = function enrollStatus(id) {
  let foundIndex;
  const exists = loggedInUser.find((ele, index) => {
    foundIndex = index;
    return ele.id == id;
  });
  if (!exists) {
    makeUserOnlineFromDB(id);
    makeUserOfflineFromDB(id);
  }
  else {
    clearTimeout(exists.token);
    loggedInUser.splice(foundIndex, 1);
    makeUserOnlineFromDB(id);
    makeUserOfflineFromDB(id);
  }
};
