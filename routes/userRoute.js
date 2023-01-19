const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/login-web").post(authController.loginWeb);
router.route("/login-mobile").post(authController.loginMobile);
router.route("/logout").get(authController.logout);

router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.createUser);

router.route("/cars").get(userController.getAllFilterUser);
// router.route("/filter").get(userController.getAllFilterUser);

router.route("/edit/:uuid").patch(userController.updatedUser);
router.route("/update-car/:uuid").patch(userController.updateUserCar);
router.route("/delete/:uuid").patch(userController.deleteUser);

// route Check User Active
router.route("/check-user-is-active/:id").get(userController.checkUserStatus);

module.exports = router;
