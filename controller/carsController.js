const db = require("../model");
const { Op } = require("sequelize");
const Cars = db.cars;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const multerStorage = multer.memoryStorage();
var fs = require("fs");
var xlsx = require("node-xlsx");
const Excel = require("exceljs");

const multerFilter = (req, file, cb) => {
  cb(null, true);
  if (
    file.mimetype.startsWith(
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
  ) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Excell! Please upload only XLSX", 400), false);
  }
};

// store excel files into one folder
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = `public/file/import/`;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, "public/file/import/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});
const uploadRequestCar = upload.single("cars_data");
const postCars = catchAsync(async (req, res, next) => {
  const checkCars = await Cars.findAll({
    order: [["id", "DESC"]],
  });

  if (checkCars.length > 0) {
    await Cars.destroy({
      where: {},
      truncate: true,
    });
  }
  let rows = [];
  const options = {
    dateFormat: "YYYY-MM-DD",
  };
  var workbook = new Excel.Workbook();
  workbook.xlsx
    .readFile("public/file/import/" + req.file.filename, options)
    .then(function () {
      ws = workbook.getWorksheet(1);
      ws.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
        rows.push({
          driver_import: row.values[1],
          license_plate: row.values[2],
          merk_vehicle: row.values[3]
            ? row.values[3].substring(0, row.values[3].lastIndexOf("/"))
            : "null",
          model_vehicle: row.values[3]
            ? row.values[3].substring(row.values[3].lastIndexOf("/") + 1)
            : "null",
          driver_future_import: row.values[4] ? row.values[4] : "null",
          chassis_number: row.values[5]
            ? row.values[5].substring(0, row.values[5].lastIndexOf("/")).trim()
            : "null",
          number_machine: row.values[5]
            ? row.values[5].substring(row.values[5].lastIndexOf("/") + 1).trim()
            : "null",
          immatriculation_date: row.values[6] ? row.values[6] : null,
          company: row.values[7],
          ownership: row.values[8] ? row.values[8] : "null",
          location_odoo: row.values[9] ? row.values[9] : "null",
          pull_or_takehome: row.values[10] ? row.values[10] : null,
        });
      });

      let newArr = rows.slice(1);
      (async () => {
        const cars = await Cars.bulkCreate(newArr, {
          returning: true,
          updateOnDuplicate: ["license_plate"],
        });

        res.status(200).json({
          status: "success submit",
          data: {
            cars,
          },
        });
      })();
    });

  // var obj = xlsx.parse("public/file/import/" + req.file.filename, {
  //   cellDates: true,
  // }); // parses a file
  // let rows = [];
  // for (var i = 0; i < obj.length; i++) {
  //   var sheet = obj[i];
  //   //loop through all rows in the sheet
  //   for (var j = 0; j < sheet["data"].length; j++) {
  //     //add the row to the rows array
  //     rows.push(sheet["data"][j]);
  //   }
  // }

  // let newArr = rows.map((item) => ({
  //   driver_import: item[0] ? item[0] : "null",
  //   license_plate: item[1],
  //   model_vehicle: item[2],
  //   merk_vehicle: item[2]
  //     ? item[2].substring(0, item[2].lastIndexOf("/"))
  //     : "null",
  //   model_vehicle: item[2]
  //     ? item[2].substring(item[2].lastIndexOf("/") + 1)
  //     : "null",
  //   driver_future_import: item[3] ? item[3] : "null",
  //   chassis_number: item[4]
  //     ? item[4].substring(0, item[4].lastIndexOf("/")).trim()
  //     : "null",
  //   number_machine: item[4]
  //     ? item[4].substring(item[4].lastIndexOf("/") + 1).trim()
  //     : "null",
  //   immatriculation_date: item[5] ? convertTZ(item[5], "Asia/Jakarta") : null,
  //   ownership: item[7] ? item[7] : "null",
  //   location_odoo: item[8] ? item[8] : "null",
  //   pull_or_takehome: item[9] ? item[9] : "null",
  // }));

  // newArr = newArr.slice(1);

  // const cars = await Cars.bulkCreate(newArr, {
  //   returning: true,
  //   updateOnDuplicate: ["license_plate"],
  // });
});

const getAllCars = catchAsync(async (req, res, next) => {
  let location_odoo = req.query.location_odoo;
  let merk_vehicle = req.query.merk_vehicle;
  let model_vehicle = req.query.model_vehicle;
  let ownership = req.query.ownership;
  let pull_or_takehome = req.query.pull_or_takehome;
  let offline_car = req.query.offline_car;

  let options = {};

  if (location_odoo) {
    options = {
      where: {
        location_odoo,
      },
    };
  }

  if (merk_vehicle)
    options = {
      where: {
        merk_vehicle,
      },
    };

  if (model_vehicle)
    options = {
      where: {
        model_vehicle,
      },
    };

  if (ownership)
    options = {
      where: {
        ownership,
      },
    };

  if (pull_or_takehome)
    options = {
      where: {
        pull_or_takehome,
      },
    };

  if (offline_car)
    options = {
      where: {
        offline_car: true,
      },
    };

  if (location_odoo && model_vehicle) {
    options = {
      where: {
        location_odoo,
        model_vehicle,
      },
    };
  }

  if (location_odoo && ownership) {
    options = {
      where: {
        location_odoo,
        ownership,
      },
    };
  }

  if (location_odoo && pull_or_takehome) {
    options = {
      where: {
        location_odoo,
        pull_or_takehome,
      },
    };
  }

  if (merk_vehicle && model_vehicle)
    options = {
      where: {
        merk_vehicle,
        model_vehicle,
      },
    };

  if (merk_vehicle && ownership)
    options = {
      where: {
        merk_vehicle,
        ownership,
      },
    };

  if (merk_vehicle && pull_or_takehome)
    options = {
      where: {
        merk_vehicle,
        pull_or_takehome,
      },
    };

  if (merk_vehicle && offline_car)
    options = {
      where: {
        merk_vehicle,
        offline_car: true,
      },
    };

  if (model_vehicle && ownership)
    options = {
      where: {
        model_vehicle,
        ownership,
      },
    };

  if (model_vehicle && pull_or_takehome)
    options = {
      where: {
        model_vehicle,
        pull_or_takehome,
      },
    };

  if (model_vehicle && offline_car)
    options = {
      where: {
        model_vehicle,
        offline_car: true,
      },
    };

  if (ownership && pull_or_takehome)
    options = {
      where: {
        ownership,
        pull_or_takehome,
      },
    };

  if (ownership && offline_car)
    options = {
      where: {
        ownership,
        offline_car: true,
      },
    };

  if (pull_or_takehome && offline_car)
    options = {
      where: {
        pull_or_takehome,
        offline_car: true,
      },
    };

  if (location_odoo && model_vehicle && ownership) {
    options = {
      where: {
        location_odoo,
        model_vehicle,
        ownership,
      },
    };
  }

  if (location_odoo && model_vehicle && pull_or_takehome) {
    options = {
      where: {
        location_odoo,
        model_vehicle,
        pull_or_takehome,
      },
    };
  }

  if (location_odoo && model_vehicle && ownership && pull_or_takehome) {
    options = {
      where: {
        location_odoo,
        model_vehicle,
        ownership,
        pull_or_takehome,
      },
    };
  }

  if (merk_vehicle && model_vehicle && ownership)
    options = {
      where: {
        merk_vehicle,
        model_vehicle,
        ownership,
      },
    };

  if (merk_vehicle && model_vehicle && ownership && pull_or_takehome)
    options = {
      where: {
        merk_vehicle,
        model_vehicle,
        ownership,
        pull_or_takehome,
      },
    };

  if (
    merk_vehicle &&
    model_vehicle &&
    ownership &&
    pull_or_takehome &&
    offline_car
  )
    options = {
      where: {
        merk_vehicle,
        model_vehicle,
        ownership,
        pull_or_takehome,
        offline_car: true,
      },
    };

  const cars = await Cars.findAll(options);

  if (cars == "") {
    res.status(200).json({
      status: "success",
      total_data: 0,
      data: {
        cars,
      },
    });
    return;
  }

  res.status(200).json({
    status: "success",
    total_data: cars.length,
    data: {
      cars,
    },
  });
});

const getLocationOdoo = catchAsync(async (req, res, next) => {
  let location = await Cars.findAll({
    order: [["id", "DESC"]],
  });

  location = location.map((item) => ({
    value: item.id,
    label: item.location_odoo,
  }));

  location = location.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.label === value.label)
  );

  res.status(200).json({
    status: "success",
    data: {
      location,
    },
  });
});

const updateActiveCar = catchAsync(async (req, res, next) => {
  const id_car = req.params.id;
  const active = req.body.offline_car;

  const checkcar = await Cars.findAll({
    where: {
      id: id_car,
    },
  });

  if (checkcar.length === 0) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  const data = {
    offline_car: active,
  };

  await Cars.update(data, {
    where: {
      id: id_car,
    },
  });

  res.status(200).json({
    status: "success update",
  });
});

module.exports = {
  getAllCars,
  getLocationOdoo,
  updateActiveCar,
  postCars,
  uploadRequestCar,
};
