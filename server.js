// import module
const dotenv = require("dotenv");

// Error Exception
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const { app } = require("./app");
// socket io
const http = require("http");
// const server = http.createServer(app);
// const Server = require("socket.io");
// const io = require("socket.io")(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("a user connection");
// });

// server setting
const port = 1010;
server = app.listen(port, "0.0.0.0", () => {
  console.log(`App running on port ${port}...`);
});

// Handle rejection error
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// module.exports.ioObj = io;
