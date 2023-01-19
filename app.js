// import module
const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const xss = require("xss-clean");
const Sequelize = require("sequelize");
const dbConfig = require("./config/database.js");
const path = require("path");
const bodyParser = require("body-parser");

// Initial express
const app = express();

// Set security HTTP headers
app.use(helmet());
app.use(cors());

// Serving static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Handler Error
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

// Check Connection DB
var checkdb = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
});

checkdb
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Limit requests from same API
const limiter = rateLimit({
  max: 20,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// app.use(bodyParser.json());

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

// Data sanitization against XSS
app.use(xss());

// Routes
const userRoute = require("./routes/userRoute");
const roleRoute = require("./routes/roleRoute");
const menuRoute = require("./routes/menuRoute");
const areaRoute = require("./routes/areaRoute");
const departementRoute = require("./routes/departementRoute");
const carsRoute = require("./routes/carsRoute");
const locationRoute = require("./routes/locationRoute");
const reportRoute = require("./routes/reportRoute");
const notificationRoute = require("./routes/notifRoute");

// URL
app.use("/api/v1/user", userRoute);
app.use("/api/v1/role", roleRoute);
app.use("/api/v1/menu", menuRoute);
app.use("/api/v1/area", areaRoute);
app.use("/api/v1/departement", departementRoute);
app.use("/api/v1/cars", carsRoute);
app.use("/api/v1/location", locationRoute);
app.use("/api/v1/report", reportRoute);
app.use("/api/v1/notif", notificationRoute);

// Handle Not Found
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Handler
app.use(globalErrorHandler);

module.exports = {
  app,
};
