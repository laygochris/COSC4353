const express = require("express");
const { getVolunteers, matchVolunteersToEvent } = require("../controllers/volunteerController");

const router = express.Router();

router.get("/", getVolunteers); 
router.get("/match/:volunteerId", matchVolunteersToEvent);

module.exports = router;
