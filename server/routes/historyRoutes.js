const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
  getAllEvents,
  getVolunteerHistory,
  assignVolunteerToEvent,
} = require("../controllers/historyController");

// ✅ GET /api/history/events - Returns all events
router.get("/events", getAllEvents);

// ✅ GET /api/history/profile/:userId - Returns volunteer history for a specific user
router.get("/profile/:userId", verifyToken, getVolunteerHistory);

// ✅ POST /api/history/assign - Assign a volunteer to an event
router.post("/assign", assignVolunteerToEvent);


module.exports = router;
