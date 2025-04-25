const express = require("express");
const router = express.Router();
const {
    getVolunteers,  
    getVolunteerByEmail,
    matchVolunteersToEvent,
    createVolunteer,
    getVolunteerById,
    assignVolunteerToEvent, 
} = require("../controllers/volunteerController");

// Routes
router.get("/", getVolunteers);
router.get("/volunteer/email", getVolunteerByEmail);
router.get("/volunteer/:volunteerId", getVolunteerById);
router.get("/match/:volunteerId", matchVolunteersToEvent);
router.post("/volunteer", createVolunteer);
router.post("/volunteers/events/:eventId/assign", assignVolunteerToEvent);

module.exports = router;