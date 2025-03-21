const express = require("express");
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    assignVolunteerToEvent
} = require("../controllers/eventController");

// ✅ Get all events
router.get("/events", getEvents);

// ✅ Get a specific event by ID (ObjectId validation)
router.get("/events/:eventId", getEventById);

// ✅ Create a new event
router.post("/events", createEvent);

// ✅ Assign a volunteer (ObjectId) to an event
router.post("/events/assign", assignVolunteerToEvent);

module.exports = router;
