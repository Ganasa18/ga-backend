const express = require("express");
const authController = require("../controller/authController");
const carsController = require("../controller/carsController");

const router = express.Router();
router.route("/").get(carsController.getAllCars);
router.route("/location").get(carsController.getLocationOdoo);

router
  .route("/import")
  .post(carsController.uploadRequestCar, carsController.postCars);

router.route("/activecar/:id").patch(carsController.updateActiveCar);

module.exports = router;
