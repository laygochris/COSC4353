const express = require("express");
const router = express.Router();
const { getNotifications, addNotification, deleteNotification } = require("../controllers/notificationController");

router.get("/", getNotifications);
router.post("/", addNotification);
router.delete("/:id", deleteNotification);

module.exports = router;
