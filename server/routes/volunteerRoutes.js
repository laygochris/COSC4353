const express = require("express");
const { getVolunteers, matchVolunteersToEvent } = require("../controllers/volunteerController"); // Removed createVolunteer

const router = express.Router();

router.get("/", getVolunteers);
router.get("/match/:volunteerId", matchVolunteersToEvent);

module.exports = router;
