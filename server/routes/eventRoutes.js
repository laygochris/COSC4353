const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  assignVolunteerToEvent
} = require("../controllers/eventController");

// Create event - protected route similar to userProfileRoutes
router.post("/create", verifyToken, createEvent);

// Get all events
router.get("/", getEvents);

// Get event by ID
router.get("/:id", getEventById);

// Update event - protected route
router.put("/update", verifyToken, updateEvent);

// Delete event - protected route
router.delete("/:eventId", verifyToken, deleteEvent);

// Assign volunteer to an event - protected route
router.post("/assign", verifyToken, assignVolunteerToEvent);

// Test route for events
router.get("/test", (req, res) => {
    console.log("Event Routes are working!");
    res.json({ message: "Event Routes are working!" });
});

module.exports = router;