const express = require("express");
const router = express.Router();
const {
    getEvents,
    getEventById,
    assignVolunteerToEvent
} = require("../controllers/eventController");

router.get("/", getEvents);  // Now this matches /api/events
router.get("/:eventId", getEventById);  // Now this matches /api/events/:eventId
router.post("/assign", assignVolunteerToEvent);  // Now this matches /api/events/assign

module.exports = router;
