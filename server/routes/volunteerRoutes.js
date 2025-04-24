const express = require("express");
const router = express.Router();
const {
    getVolunteers,  
    getVolunteerByEmail,
    getVolunteerById,
    matchVolunteerToEvent, 
} = require("../controllers/volunteerController");

// Routes
router.get("/", getVolunteers);
router.get("/volunteer/email", getVolunteerByEmail);
router.get("/volunteer/:volunteerId", getVolunteerById);
router.post("/events/:eventId/match", matchVolunteerToEvent);

module.exports = router;
