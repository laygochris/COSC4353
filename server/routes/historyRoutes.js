const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const Event = require("../models/events"); 

const {
    getAllEvents,
    getVolunteerHistory,
    assignVolunteerToEvent,
    removeVolunteerFromEvent
} = require("../controllers/historyController");

// ✅ This must exist to handle GET /api/history/events
router.get("/events", getAllEvents);
router.get("/profile/:id", verifyToken, async (req, res) => {
    console.log("Received request for userId:", req.params.userId);
    try {
      const userId = req.user.id;
      const userEvents = await Event.find({ assignedVolunteers: userId });
  
      if (!userEvents.length) {
        return res.status(404).json({ message: "No volunteer history found for this user" });
      }
      res.json(userEvents);
    } catch (error) {
      console.error("Error fetching volunteer history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  router.post("/assign", assignVolunteerToEvent);
router.post("/remove", removeVolunteerFromEvent);

module.exports = router;
