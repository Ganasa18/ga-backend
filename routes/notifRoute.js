const express = require("express");
const router = express.Router();
const notifController = require("../controller/notifController");

router.route("/").get(notifController.getNotification);

module.exports = router;
