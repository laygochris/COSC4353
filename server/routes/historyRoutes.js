const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");
const verifyToken = require("../middleware/verifyToken"); // Middleware to verify JWT token

router.get("/", verifyToken, historyController.getVolunteerHistory);

module.exports = router;
