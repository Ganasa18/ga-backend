const express = require("express");
const authController = require("../controller/authController");
const menuController = require("../controller/menuController");

const router = express.Router();

router
  .route("/")
  .get(menuController.getAllMenu)
  .post(menuController.createMenu);
router.route("/edit/:id").patch(menuController.editMenu);
router.route("/delete/:id").patch(menuController.deleteMenu);

router.route("/menu-acc").post(menuController.createMenuAcc);
router.route("/menu-access-user/:id").get(menuController.getMenuAcc);

module.exports = router;
