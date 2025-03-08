const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController"); // ✅ Ensure this import is correct
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, notificationController.getUserNotifications);

router.delete("/:id", verifyToken, notificationController.dismissNotification);

router.post("/", verifyToken, notificationController.createNotification);

module.exports = router;
