const db = require("../model");
const DriverOff = db.driveroff;
const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllDriverOff = catchAsync(async (req, res, next) => {
  const offline = await DriverOff.findAll({
    order: [["id", "DESC"]],
  });
  if (offline == "") {
    res.status(200).json({
      status: "no report found",
      data: {
        offline: [],
      },
    });
    return;
  }
  res.status(200).json({
    status: "success",
    data: {
      offline,
    },
  });
});

exports.createDriverOff = catchAsync(async (req, res, next) => {
  const data = {
    user_name: req.body.user_name,
    departement: req.body.departement,
    area: req.body.area,
    remark: req.body.remark,
    assign_by: req.body.assign_by,
  };
  const report = await DriverOff.create(data);
  res.status(200).json({
    status: "success",
    data: {
      report,
    },
  });
});
