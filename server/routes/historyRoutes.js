const express = require("express");
const router = express.Router();
const volunteerHistoryController = require("../controllers/historyController");

// ✅ Ensure this endpoint is properly set up
router.get("/:volunteerId", volunteerHistoryController.getVolunteerHistory);

// ✅ Optional: Get all volunteer history
router.get("/", volunteerHistoryController.getAllEvents);

module.exports = router;
