const express = require("express");
const router = express.Router();
const volunteerHistoryController = require("../controllers/historyController");
const verifyToken = require('../middleware/verifyToken');


// Ensure this endpoint is properly set up
router.get("/:volunteerId", verifyToken, volunteerHistoryController.getVolunteerHistory);

// ✅ Optional: Get all volunteer history
router.get("/", volunteerHistoryController.getAllEvents);

module.exports = router;
