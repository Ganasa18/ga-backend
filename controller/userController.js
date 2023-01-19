const db = require("../model");
const { Op } = require("sequelize");
const User = db.users;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.getAllUser = catchAsync(async (req, res, next) => {
  let username = req.query.username;
  let phoneNumber = req.query.phoneNumber;
  let role = req.query.role;
  let area = req.query.area;
  let departement = req.query.departement;

  let options = {};

  // Execute Query

  if (username)
    options = {
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
      },
    };

  if (phoneNumber)
    options = {
      raw: true,
      where: {
        phoneNumber,
      },
    };
  if (role)
    options = {
      raw: true,
      where: {
        role,
      },
    };
  if (area)
    options = {
      raw: true,
      where: {
        area,
      },
    };

  if (username && area)
    options = {
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
        area,
      },
    };

  if (username && role)
    options = {
      where: {
        username: {
          [Op.like]: `%${username}%`,
        },
        role,
      },
    };
  if (area && departement)
    options = {
      where: {
        area,
        departement,
      },
    };

  const users = await User.findAll(options);
  if (users == "") {
    return next(new AppError("No User Found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const data = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    area: req.body.area,
    departement: req.body.departement,
    role: req.body.role,
    is_active: true,
    plate_car: req.body.plate_car,
    password: !req.body.password ? "123" : req.body.password,
  };

  const userFind = await User.findOne({
    where: {
      phoneNumber: req.body.phoneNumber,
    },
  });

  if (userFind) {
    return next(new AppError("User already exists", 422));
  }

  const user = await User.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      user,
    },
  });
});

exports.updatedUser = catchAsync(async (req, res, next) => {
  const uuid = req.params.uuid;

  const checkuser = await User.findAll({
    where: {
      uuid: uuid,
    },
  });

  if (checkuser == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  const salt = bcrypt.genSaltSync(10);
  const password = !req.body.password ? "123" : req.body.password;
  const hashPassword = bcrypt.hashSync(password, salt);

  const data = {
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    area: req.body.area,
    departement: req.body.departement,
    plate_car: req.body.plate_car,
    password: hashPassword,
  };

  await User.update(data, {
    where: {
      uuid: uuid,
    },
  });

  res.status(200).json({
    status: "success updated",
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const uuid = req.params.uuid;

  const checkuser = await User.findAll({
    where: {
      uuid: uuid,
    },
  });

  if (checkuser == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  const data = {
    is_active: req.body.is_active,
  };

  console.log(data);
  await User.update(data, {
    where: {
      uuid: uuid,
    },
  });

  res.status(200).json({
    status: "success updated",
    data: {
      user: `delete success`,
    },
  });
});

exports.getAllJoinUser = catchAsync(async (req, res, next) => {
  const users = await db.sequelize.query(
    `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
    m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
    FROM users
    LEFT JOIN m_cars 
    ON users.plate_car = m_cars.license_plate
    LEFT JOIN m_areas 
    ON users.area = m_areas.id
    LEFT JOIN m_departements 
    ON users.departement = m_departements.id
    ORDER BY users.id DESC;
    `,
    {
      model: User,
      mapToModel: true, // pass true here if you have any mapped fields
    }
  );

  if (users == "") {
    return next(new AppError("No users found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      users,
    },
  });
});

exports.getAllFilterUser = catchAsync(async (req, res, next) => {
  const id_area = req.query.area;
  const departement = req.query.departement;
  const car = req.query.car;
  let users;

  if (id_area == undefined && departement == undefined && car == undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      ORDER BY users.id DESC;
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }

  if (id_area != undefined && departement != undefined && car != undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      WHERE users.area = ${id_area} AND m_departements.departement_name LIKE '${departement}%' AND users.plate_car LIKE '${car}%'
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    if (users == "") {
      users = [];
    }

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }

  if (id_area != undefined && departement != undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      WHERE users.area = ${id_area} AND m_departements.departement_name LIKE '${departement}%'
      ORDER BY users.id DESC;
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }

  if (id_area != undefined && car != undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      WHERE users.area = ${id_area} AND users.plate_car LIKE '${car}%'
      ORDER BY users.id DESC;
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }

  if (departement != undefined && car != undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      WHERE m_departements.departement_name LIKE '${departement}%' AND users.plate_car LIKE '${car}%'
      ORDER BY users.id DESC;
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }

  if (id_area != undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      WHERE users.area = ${id_area}
      ORDER BY users.id DESC;
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }

  if (departement != undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      WHERE m_departements.departement_name LIKE '${departement}%'
      ORDER BY users.id DESC;
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }

  if (car != undefined) {
    users = await db.sequelize.query(
      `SELECT users.*, m_cars.license_plate, m_cars.model_vehicle, m_cars.id as car_pk, m_areas.area_name, 
      m_areas.id as area_pk, m_departements.id as departement_pk, m_departements.departement_name
      FROM users
      LEFT JOIN m_cars 
      ON users.plate_car = m_cars.license_plate
      LEFT JOIN m_areas 
      ON users.area = m_areas.id
      LEFT JOIN m_departements 
      ON users.departement = m_departements.id
      WHERE users.plate_car LIKE '${car}%'
      ORDER BY users.id DESC;
      `,
      {
        model: User,
        mapToModel: true, // pass true here if you have any mapped fields
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        users,
      },
    });

    return;
  }
});

exports.updateUserCar = catchAsync(async (req, res, next) => {
  const car1 = req.body.car1;
  const car2 = req.body.car2;
  const car3 = req.body.car3;
  const uuid = req.params.uuid;
  const checkuser = await User.findAll({
    where: {
      uuid: uuid,
    },
  });

  if (checkuser == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  const data = {
    car_1: !car1 || car1 == "" ? null : car1,
    car_2: !car2 || car2 == "" ? null : car2,
    car_3: !car3 || car3 == "" ? null : car3,
  };

  await User.update(data, {
    where: {
      uuid: uuid,
    },
  });

  res.status(200).json({
    status: "success updated car",
  });
});

exports.checkUserStatus = catchAsync(async (req, res, next) => {
  const id_user = req.params.id;

  const checkUserStatus = await User.findAll({
    where: {
      id: id_user,
    },
    attributes: ["id", "is_active"],
  });

  res.status(200).json({
    status: "success",
    data: {
      status_user: checkUserStatus,
    },
  });
});
