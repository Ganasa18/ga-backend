const express = require("express");
const authController = require("../controller/authController");
const areaController = require("../controller/areaController");

const router = express.Router();
router
  .route("/")
  .get(areaController.getAllArea)
  .post(areaController.createArea);

router
  .route("/:id")
  .patch(areaController.updatedArea)
  .delete(areaController.deleteArea);

module.exports = router;
