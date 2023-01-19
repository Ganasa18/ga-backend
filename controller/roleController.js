const db = require("../model");
const { Op } = require("sequelize");
const Roles = db.roles;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllRole = catchAsync(async (req, res, next) => {
  const roles = await Roles.findAll({
    order: [["id", "DESC"]],
  });

  if (roles == "") {
    return next(new AppError("No roles found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      roles,
    },
  });
});

exports.getRoleById = catchAsync(async (req, res, next) => {
  const role = await Roles.findByPk(req.params.id);

  if (!role) {
    return next(new AppError("No role found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      role,
    },
  });
});

exports.createRole = catchAsync(async (req, res, next) => {
  const role = await Roles.create(req.body);
  res.status(200).json({
    status: "success created",
    data: {
      role,
    },
  });
});

exports.updatedRole = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = {
    role_name: req.body.role_name,
  };
  await Roles.update(data, {
    where: {
      id: id,
    },
  });
  const checkrole = await Roles.findByPk(id);

  if (checkrole == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  res.status(200).json({
    status: "success updated",
    data: {
      role: `updated with id = ${id}`,
    },
  });
});

exports.deleteRole = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const checkRole = await Roles.count({
    where: {
      id: id,
    },
  });

  if (checkRole != 0) {
    await role.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: `success deleted ${id}`,
    });
  } else {
    return next(new AppError("Delete must with valid ID", 400));
  }
});
