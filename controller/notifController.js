const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const express = require("express");
const socket = require("../server");

exports.getNotification = catchAsync(async (req, res, next) => {
  socket.ioObj.sockets.emit("message", "hello world");
  res.status(200).json({
    status: "success",
  });
});
