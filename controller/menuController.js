const db = require("../model");
const { Op } = require("sequelize");
const Menu = db.menus;
const MenuAccess = db.menusacc;
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllMenu = catchAsync(async (req, res, next) => {
  let name = req.params.menu_name;

  if (name)
    options = {
      where: {
        menu_name: {
          [Op.like]: `%${name}%`,
        },
      },
    };

  let options = {};

  const menus = await Menu.findAll(options);

  if (menus == "") {
    return next(new AppError("No menus found"));
  }

  res.status(200).json({
    status: "success",
    data: {
      menus,
    },
  });
});

exports.createMenu = catchAsync(async (req, res, next) => {
  const data = {
    menu_name: req.body.menu_name,
    menu_url: req.body.menu_url,
    menu_icon: req.body.menu_icon,
  };
  const menu = await Menu.create(data);
  res.status(200).json({
    status: "success created",
    data: {
      menu,
    },
  });
});

exports.editMenu = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = {
    menu_name: req.body.menu_name,
    menu_url: req.body.menu_url,
    menu_icon: req.body.menu_icon,
  };

  await Menu.update(data, {
    where: {
      id: id,
    },
  });
  const checkmenu = await Menu.findByPk(id);

  if (checkmenu == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }
  res.status(200).json({
    status: "success updated",
    data: {
      role: `updated with id = ${id}`,
    },
  });
});

exports.deleteMenu = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const data = {
    is_deleted: req.body.is_deleted,
  };

  await Menu.update(data, {
    where: {
      id: id,
    },
  });
  const checkmenu = await Menu.findByPk(id);

  if (checkmenu == null) {
    return next(new AppError("Edit must with valid ID", 400));
  }
  res.status(200).json({
    status: "success deleted",
    data: {
      role: `deleted with id = ${id}`,
    },
  });
});

exports.createMenuAcc = catchAsync(async (req, res, next) => {
  const data = {
    menu_id: req.body.menu_id,
    user_id: req.body.user_id,
  };

  const checkmenu = await MenuAccess.findAll({
    where: {
      menu_id: req.body.menu_id,
      user_id: req.body.user_id,
    },
  });

  if (checkmenu.length == 0) {
    const menuacc = await MenuAccess.create(data);
    res.status(200).json({
      status: "success created",
      data: {
        menuacc,
      },
    });
    return;
  }

  // const menuacc = await MenuAccess.create(req.body);
  const menuacc = await MenuAccess.update(data, {
    where: {
      menu_id: req.body.menu_id,
      user_id: req.body.user_id,
    },
  });
  res.status(200).json({
    status: "success updated",
    data: {
      menuacc,
    },
  });
});

exports.getMenuAcc = catchAsync(async (req, res, next) => {
  const user_id = req.params.id;
  const menus = await db.sequelize.query(
    `SELECT m_menus.*, m_menu_accesses.menu_id, m_menu_accesses.user_id as user_pk,users.id as id_user, users.username
    FROM m_menus
    LEFT JOIN m_menu_accesses 
    ON m_menu_accesses.menu_id = m_menus.id
    INNER JOIN users
    ON m_menu_accesses.user_id = users.id
    WHERE m_menu_accesses.user_id = ${user_id}
    ORDER BY m_menus.id ASC
    `,
    {
      model: Menu,
      mapToModel: true, // pass true here if you have any mapped fields
    }
  );

  // console.log(menus);

  // if (menus.length == 0) {
  //   return next(new AppError("No menu found"));
  // }

  res.status(200).json({
    status: "success",
    data: {
      menus,
    },
  });
});
