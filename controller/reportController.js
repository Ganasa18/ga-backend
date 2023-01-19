const db = require("../model");
const Report = db.reports;
const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const convertTZ = require("../utils/convertDate");
var path = require("path");
var mime = require("mime");
var fs = require("fs");
const { editValue } = require("../utils/updateLoc");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadOdometerPhoto = upload.single("picture_odometer");

const resizeRequestPhoto = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  if (!req.file) return next();

  req.file.filename = `odometer-image-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(`public/image/odometer/${req.file.filename}`);
  next();
});

const getAllReport = catchAsync(async (req, res, next) => {
  const area = req.query.area;
  const departement = req.query.departement;
  const car = req.query.car;
  let dateFrom = req.query.dateFrom;
  let dateTo = req.query.dateTo;
  const newLoc = req.query.newlocation;

  if (dateFrom) {
    dateFrom = new Date(dateFrom);
  }

  if (dateTo) {
    dateTo = new Date(dateTo);
  }

  let options = {};

  if (area)
    options = {
      where: {
        area,
      },
    };

  if (departement)
    options = {
      raw: true,
      where: {
        departement,
      },
    };

  if (car)
    options = {
      raw: true,
      where: {
        plate_car: car,
      },
    };

  if (newLoc === "true") {
    options = {
      where: {
        newLocation: true,
      },
    };
  }

  if (dateFrom) {
    options = {
      where: {
        createdAt: {
          [Op.lte]: dateFrom,
        },
      },
    };
  }

  if (dateFrom && dateTo) {
    options = {
      where: {
        [Op.or]: [
          {
            createdAt: {
              [Op.between]: [dateFrom, dateTo],
            },
          },
          {
            updatedAt: {
              [Op.between]: [dateFrom, dateTo],
            },
          },
        ],
      },
    };
  }

  if (area && departement) {
    options = {
      where: {
        area,
        departement,
      },
    };
  }
  if (area && car) {
    options = {
      where: {
        area,
        plate_car: car,
      },
    };
  }

  if (area && dateFrom) {
    options = {
      where: {
        area,
        createdAt: {
          [Op.lte]: dateFrom,
        },
      },
    };
  }
  if (car && dateFrom) {
    options = {
      where: {
        plate_car: car,
        createdAt: {
          [Op.lte]: dateFrom,
        },
      },
    };
  }

  const reports = await Report.findAll(options);

  if (reports == "") {
    res.status(200).json({
      status: "no report found",
      data: {
        reports: [],
      },
    });
    return;
  }

  res.status(200).json({
    status: "success",
    data: {
      reports,
    },
  });
});

const createReport = catchAsync(async (req, res, next) => {
  const data = {
    user_name: req.body.username,
    plate_car: req.body.plate_car,
    car_name: req.body.car_name,
    departement: req.body.departement,
    area: req.body.area,
    km_awal: parseInt(req.body.odometer),
    picture_1: !req.file ? null : `public/image/odometer/${req.file.filename}`,
  };

  const report = await Report.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      report,
    },
  });
});

const checkTodayReport = catchAsync(async (req, res, next) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  const username = req.params.username;
  let today = 0;
  const check = await Report.findAll({
    where: {
      user_name: username,
      createdAt: {
        [Op.gte]: TODAY_START,
        // [Op.lt]: NOW,
      },
    },
  });

  if (check.length == 0) {
    today = 1;
    res.status(200).json({
      count: today,
      status: "no created data",
    });
    return;
  }

  if (check.length > 0) {
    if (check[0].km_akhir === null || check[0].km_akhir === 0) {
      today = 2;
      res.status(200).json({
        status: "no data km 2",
        count: today,
        data: {
          check,
        },
      });
      return;
    }

    if (check[0].location == null) {
      today = 3;
      res.status(200).json({
        status: "no data location",
        count: today,
        data: {
          check,
        },
      });
      return;
    }

    if (check[0].location != null) {
      today = 4;
      res.status(200).json({
        status: "today complete",
        count: today,
        data: {
          check,
        },
      });
    }
    return;
  }
});

const updateKilometer = catchAsync(async (req, res, next) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  const nowDate = convertTZ(NOW, "Asia/Jakarta");

  const data = {
    user_name: req.body.username,
    picture_2: !req.file ? null : `public/image/odometer/${req.file.filename}`,
    km_akhir: parseInt(req.body.odometer),
    km_total: parseInt(req.body.km_total),
    updateAt: nowDate,
  };

  await Report.update(data, {
    where: {
      user_name: req.body.username,
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });

  res.status(200).json({
    status: "success",
  });
});

const updateLocationData = catchAsync(async (req, res, next) => {
  const TODAY_START = new Date().setHours(0, 0, 0, 0);
  const NOW = new Date();
  const nowDate = convertTZ(NOW, "Asia/Jakarta");
  const username = req.params.username;

  let filterLoc = req.body.location;
  filterLoc = JSON.parse(filterLoc);
  // console.log(filterLoc);

  filterLoc = filterLoc
    .filter((docType) => docType.location !== "")
    .map((item) => ({
      key: item.key,
      category: item.category,
      location: item.location,
      tag: item.tag,
      newLoc: item.newLoc,
    }));

  filterLoc = JSON.stringify(filterLoc);

  const data = {
    location: filterLoc,
    newLocation: req.body.newLocation,
    locationDate: nowDate,
  };

  await Report.update(data, {
    where: {
      user_name: username,
      createdAt: {
        [Op.gt]: TODAY_START,
        [Op.lt]: NOW,
      },
    },
  });

  res.status(201).json({
    status: "success",
  });
});

const checkTotalKm = catchAsync(async (req, res, next) => {
  const username = req.params.username;
  const reqMonth = req.query.month;
  const monthSelected = new Date(reqMonth).getMonth() + 1;

  if (reqMonth) {
    const report = await db.sequelize.query(
      `SELECT m_reports.* FROM m_reports
    WHERE user_name = '${username}' AND MONTH(createdAt) = '${monthSelected}'
    `,
      {
        raw: true,
        model: Report,
        mapToModel: true,
      }
    );

    let total = 0;
    let visit = 0;
    report.map((item, index) => {
      total = item.km_total + total;
      if (item.location !== null) {
        const location = JSON.parse(item.location);
        visit = location.length + visit;
      }
    });

    res.status(200).json({
      status: "success",
      total_km: total,
      visit,
      data: {
        report,
      },
    });

    return;
  }

  const todayMonth = new Date().getMonth() + 1;
  const report = await db.sequelize.query(
    `SELECT m_reports.* FROM m_reports
    WHERE user_name = '${username}' AND MONTH(createdAt) = '${todayMonth}'
    `,
    {
      raw: true,
      model: Report,
      mapToModel: true,
    }
  );

  let total = 0;
  let visit = 0;
  report.map((item, index) => {
    total = item.km_total + total;
    if (item.location !== null) {
      const location = JSON.parse(item.location);
      visit = location.length + visit;
    }
  });

  res.status(200).json({
    status: "success",
    total_km: total,
    visit,
    data: {
      report,
    },
  });
});

const updateReportLocation = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const checkReport = await Report.findAll({
    where: {
      id,
    },
  });

  if (checkReport.length === 0) {
    return next(new AppError("Report with this id not found"));
  }
  const data = {
    newLocation: false,
  };

  await Report.update(data, {
    where: {
      id,
    },
  });

  res.status(201).json({
    status: "success update",
  });
});

const updateStatusLocation = catchAsync(async (req, res, next) => {
  let dataNow = req.body.status_now;
  const id = req.params.id;

  const check = await Report.findAll({
    where: {
      id,
    },
  });

  let location = check[0]?.dataValues?.location;
  location = JSON.parse(location);
  let updateLoc = editValue(location, dataNow.key, dataNow.newLoc);
  updateLoc = JSON.stringify(updateLoc);

  const data = {
    location: updateLoc,
  };

  await Report.update(data, {
    where: {
      id,
    },
  });

  res.status(201).json({
    status: "success update",
  });
});

const checkCountNewLocation = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const check = await Report.findAll({
    where: {
      id,
    },
  });

  let location = check[0]?.dataValues?.location;
  location = JSON.parse(location);

  location = location.filter((item) => item.newLoc === true);
  res.status(200).json({
    status: "success",
    count: location.length,
  });
});

module.exports = {
  uploadOdometerPhoto,
  resizeRequestPhoto,
  getAllReport,
  createReport,
  checkTodayReport,
  updateKilometer,
  updateLocationData,
  checkTotalKm,
  updateReportLocation,
  updateStatusLocation,
  checkCountNewLocation,
};
