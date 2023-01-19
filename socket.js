const { Server } = require("socket.io");
let io;

module.exports = {
  init: (server) => {
    new Server(server, {
      cors: "*",
    });
    return io;
  },
  get: () => {
    if (!io) {
      throw new Error("socket is not initialized");
    }
    return io;
  },
};
