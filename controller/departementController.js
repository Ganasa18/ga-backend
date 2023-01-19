const db = require("../model");
const { Op } = require("sequelize");
const Departement = db.departements;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllDepartement = catchAsync(async (req, res, next) => {
  const departements = await db.sequelize.query(
    `SELECT m_departements.*, m_areas.area_name, m_areas.id as area_pk
    FROM m_departements
    LEFT JOIN m_areas 
    ON m_departements.id_area = m_areas.id
    ORDER BY m_departements.id DESC;
    `,
    {
      model: Departement,
      mapToModel: true, // pass true here if you have any mapped fields
    }
  );

  if (departements == "") {
    return next(new AppError("No departement found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      departements,
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

exports.createDepartement = catchAsync(async (req, res, next) => {
  let departement_name_val = req.body.departement_name;

  if (onlySpaces(departement_name_val)) {
    return next(new AppError("Departement must alphabet input", 400));
  }

  departement_name_val = ltrim(departement_name_val);
  departement_name_val = multipleSpace(departement_name_val);

  const data = {
    departement_name: departement_name_val,
    id_area: req.body.id_area,
  };

  const departement = await Departement.findAll({
    where: {
      departement_name: departement_name_val,
      id_area: req.body.id_area,
    },
  });

  if (departement.length > 0) {
    return next(new AppError("Departement cannot duplicate", 400));
  }

  const departements = await Departement.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      departements,
    },
  });
});

exports.updatedDepartement = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  let departement_name_val = req.body.departement_name;

  const checkdepartement = await Departement.findByPk(id);

  if (checkdepartement == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }

  if (onlySpaces(departement_name_val)) {
    return next(new AppError("Departement must alphabet input", 400));
  }

  departement_name_val = ltrim(departement_name_val);
  departement_name_val = multipleSpace(departement_name_val);

  const departement = await Departement.findAll({
    where: {
      departement_name: departement_name_val,
      id_area: req.body.id_area,
    },
  });

  if (departement.length > 0) {
    return next(new AppError("Departement cannot duplicate", 400));
  }

  const data = {
    departement_name: departement_name_val,
    id_area: req.body.id_area,
  };

  await Departement.update(data, {
    where: {
      id: id,
    },
  });

  res.status(200).json({
    status: "success updated",
    data: {
      departement: `updated with id = ${id}`,
    },
  });
});

exports.deleteDepartement = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const checkdepartement = await Departement.count({
    where: {
      id: id,
    },
  });

  if (checkdepartement != 0) {
    await Departement.destroy({
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

exports.filterDepartement = catchAsync(async (req, res, next) => {
  const id_area = req.query.id_area;
  const departements = await db.sequelize.query(
    `SELECT m_departements.*, m_areas.area_name, m_areas.id as area_pk
    FROM m_departements
    LEFT JOIN m_areas 
    ON m_departements.id_area = m_areas.id
    WHERE m_departements.id_area = ${id_area}
    ORDER BY m_departements.id DESC;
    `,
    {
      model: Departement,
      mapToModel: true, // pass true here if you have any mapped fields
    }
  );

  if (departements == "") {
    return next(new AppError("No departement found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      departements,
    },
  });
});
