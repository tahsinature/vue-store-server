let io;
module.exports = {
  init(httpServer) {
    io = require('socket.io')(httpServer, { origins: '*:*', });
    return io;
  },
  getIO() {
    if (!io) {
      throw new Error('IO not initialized');
    }
    // console.log('io initialized');
    return io;
  },
};
