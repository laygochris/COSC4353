const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController"); // ✅ Import this
const verifyToken = require('../middleware/verifyToken');


// Ensure this endpoint is properly set up
router.get("/", verifyToken, historyController.getVolunteerHistory);

// ✅ Optional: Get all volunteer history
router.get("/", historyController.getAllEvents);

module.exports = router;
