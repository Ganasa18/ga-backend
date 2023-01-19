const express = require("express");
const authController = require("../controller/authController");
const roleController = require("../controller/roleController");
const router = express.Router();

router
  .route("/")
  .get(roleController.getAllRole)
  .post(roleController.createRole);

router
  .route("/:id")
  .get(roleController.getRoleById)
  .patch(roleController.updatedRole)
  .delete(roleController.deleteRole);

module.exports = router;
