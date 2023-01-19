const express = require("express");
const authController = require("../controller/authController");
const locationController = require("../controller/locationController");

const router = express.Router();

router
  .route("/")
  .get(locationController.getAllLocation)
  .post(locationController.createLocation);

router.route("/filter").get(locationController.filterLocation);

router.route("/:id").patch(locationController.updateLocationRev);

module.exports = router;
