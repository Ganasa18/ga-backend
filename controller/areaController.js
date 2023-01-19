const db = require("../model");
const { Op } = require("sequelize");
const Area = db.areas;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const getAllArea = catchAsync(async (req, res, next) => {
  const areas = await Area.findAll({
    order: [["id", "DESC"]],
  });

  if (areas == "") {
    return next(new AppError("No area found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      areas,
    },
  });
});

function onlySpaces(str) {
  return str.trim().length === 0;
}

function ltrim(str) {
  if (!str) return str;
  return str.replace(/^\s+/g, "");
}

function multipleSpace(str) {
  return str.replace(/\s+/g, " ").trim();
}

const createArea = catchAsync(async (req, res, next) => {
  let area_name = req.body.area_name;

  if (onlySpaces(area_name)) {
    return next(new AppError("Area must alphabet input", 400));
  }
  area_name = ltrim(area_name);
  area_name = multipleSpace(area_name);

  const areas = await Area.findAll({
    where: { area_name },
  });

  if (areas.length > 0) {
    return next(new AppError("Area cannot duplicate", 400));
  }
  const area = await Area.create({ area_name: area_name });
  res.status(201).json({
    status: "success created",
    data: {
      area,
    },
  });
});

const updatedArea = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let area_name_val = req.body.area_name;

  if (onlySpaces(area_name_val)) {
    return next(new AppError("Area must alphabet input", 400));
  }
  area_name_val = ltrim(area_name_val);
  area_name_val = multipleSpace(area_name_val);

  const areas = await Area.findAll({
    where: { area_name: area_name_val },
  });

  if (areas.length > 0) {
    return next(new AppError("Area cannot duplicate", 400));
  }

  const data = {
    area_name: area_name_val,
  };

  await Area.update(data, {
    where: {
      id: id,
    },
  });
  const checkarea = await Area.findByPk(id);

  if (checkarea == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  res.status(200).json({
    status: "success updated",
    data: {
      area: `updated with id = ${id}`,
    },
  });
});

const deleteArea = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const checkarea = await Area.count({
    where: {
      id: id,
    },
  });

  if (checkarea != 0) {
    await Area.destroy({
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

module.exports = {
  getAllArea,
  createArea,
  updatedArea,
  deleteArea,
};
