// import module
const dbConfig = require("../config/database.js");
const Sequelize = require("sequelize");

// Initial Database
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.users = require("./modelUser.js")(sequelize, Sequelize);
db.roles = require("./modelRole.js")(sequelize, Sequelize);
db.areas = require("./modelArea.js")(sequelize, Sequelize);
db.departements = require("./modelDepartement.js")(sequelize, Sequelize);
db.menus = require("./modelMenu.js")(sequelize, Sequelize);
db.menusacc = require("./modelMenuAccess.js")(sequelize, Sequelize);
db.cars = require("./modelCar.js")(sequelize, Sequelize);
db.locations = require("./modelLocation.js")(sequelize, Sequelize);
db.reports = require("./modelReport.js")(sequelize, Sequelize);
db.driveroff = require("./modelDriverOff.js")(sequelize, Sequelize);

// db.sequelize.sync({});

module.exports = db;
