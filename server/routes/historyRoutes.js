const express = require("express");
const router = express.Router();
const {
    getAllEvents,
    getVolunteerHistory,
    assignVolunteerToEvent,
    removeVolunteerFromEvent
} = require("../controllers/historyController");

// ✅ This must exist to handle GET /api/history/events
router.get("/events", getAllEvents);
router.get("/:userId", getVolunteerHistory);
router.post("/assign", assignVolunteerToEvent);
router.post("/remove", removeVolunteerFromEvent);

module.exports = router;
