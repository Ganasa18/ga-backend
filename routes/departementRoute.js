const express = require("express");
const authController = require("../controller/authController");
const departementController = require("../controller/departementController");
const router = express.Router();

router
  .route("/")
  .get(departementController.getAllDepartement)
  .post(departementController.createDepartement);

router
  .route("/:id")
  .patch(departementController.updatedDepartement)
  .delete(departementController.deleteDepartement);

router.route("/filter").get(departementController.filterDepartement);

module.exports = router;
