const express = require("express");
const { getVolunteers, matchVolunteersToEvent, createVolunteer, getVolunteerByEmail } = require("../controllers/volunteerController");

const router = express.Router();

router.get("/", getVolunteers); 
router.get("/match/:volunteerId", matchVolunteersToEvent);
router.post("/create", createVolunteer);
router.get("/volunteers/me", getVolunteerByEmail);

module.exports = router;
