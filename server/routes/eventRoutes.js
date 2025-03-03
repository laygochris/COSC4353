const express = require("express");
const { getEvents, getEventById, createEvent } = require("../controllers/eventController");

const router = express.Router();

// Route to get all events
router.get("/", getEvents);

// Route to get a specific event by ID
router.get("/:id", getEventById);

// Route to create a new event
router.post("/", createEvent);

module.exports = router;  // ✅ Ensure this is properly exporting the router
