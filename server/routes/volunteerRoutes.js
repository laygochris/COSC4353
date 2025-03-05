const express = require("express");
const { getVolunteers, matchVolunteersToEvent, createVolunteer } = require("../controllers/volunteerController");

const router = express.Router();

// Define routes for volunteers
router.get("/", getVolunteers); 
router.get("/match/:volunteerId", matchVolunteersToEvent);
router.post("/create", createVolunteer);

module.exports = router;
