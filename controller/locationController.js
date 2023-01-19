const db = require("../model");
const { Op } = require("sequelize");
const Location = db.locations;

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { onlySpaces, ltrim, multipleSpace } = require("../utils/trimData");

const getAllLocation = catchAsync(async (req, res, next) => {
  let type_location = req.params.type_location;
  let options = {};
  if (type_location)
    options = {
      where: {
        type_location,
      },
    };

  const locations = await Location.findAll(options);

  if (locations == "") {
    return next(new AppError("No location found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      locations,
    },
  });
});

const createLocation = catchAsync(async (req, res, next) => {
  let location_name = req.body.location_name;

  if (onlySpaces(location_name)) {
    return next(new AppError("Location must alphabet input", 400));
  }

  location_name = ltrim(location_name);
  location_name = multipleSpace(location_name);

  const checklocation = await Location.findAll({
    where: { location_name },
  });

  if (checklocation.length > 0) {
    return next(new AppError("Name Location cannot duplicate", 400));
  }

  const data = {
    location_name: location_name,
    type_location: req.body.type_location,
    tagLocation: req.body.tagLocation,
    location_name_rev: req.body.location_name_rev,
  };
  const location = await Location.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      location,
    },
  });
});
const filterLocation = catchAsync(async (req, res, next) => {
  const type_location = req.query.type_location;

  if (!type_location) {
    const locations = await Location.findAll();
    res.status(200).json({
      status: "success",
      data: {
        locations,
      },
    });
    return;
  }
  const locations = await Location.findAll({
    where: {
      type_location,
    },
  });
  res.status(200).json({
    status: "success",
    data: {
      locations,
    },
  });
});

const updateLocationRev = catchAsync(async (req, res, next) => {
  const id = req.params.id;

  const check = await Location.findAll({
    where: {
      id,
    },
  });

  if (check.length === 0) {
    return next(new AppError("Location not found", 400));
  }

  const data = {
    location_name_rev: req.body.location_name_rev,
  };

  await Location.update(data, {
    where: {
      id,
    },
  });

  res.status(201).json({
    status: "success",
  });
});

module.exports = {
  getAllLocation,
  createLocation,
  filterLocation,
  updateLocationRev,
};
