const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");
const driverOffController = require("../controller/driverOffController");

// Report
router
  .route("/")
  .get(reportController.getAllReport)
  .post(
    reportController.uploadOdometerPhoto,
    reportController.resizeRequestPhoto,
    reportController.createReport
  );

router.route("/today/:username").get(reportController.checkTodayReport);
router
  .route("/update-kilometer")
  .patch(
    reportController.uploadOdometerPhoto,
    reportController.resizeRequestPhoto,
    reportController.updateKilometer
  );

router
  .route("/update-location/:id")
  .patch(reportController.updateReportLocation);

router
  .route("/update-location-report/:id")
  .get(reportController.checkCountNewLocation)
  .patch(reportController.updateStatusLocation);

router
  .route("/update-location-today/:username")
  .patch(reportController.updateLocationData);

router.route("/check-km/:username").get(reportController.checkTotalKm);

// Driver Off
router
  .route("/driver-off")
  .get(driverOffController.getAllDriverOff)
  .post(driverOffController.createDriverOff);

module.exports = router;
