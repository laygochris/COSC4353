const express = require("express");
const router = express.Router();
const volunteerController = require(".server/controllers/volunteercontroller");

// Define volunteer routes (without "/api/volunteers" prefix)
router.get("/", volunteerController.getVolunteers);
router.get("/match/:volunteerId", volunteerController.getMatchedEventsForVolunteer);
router.post("/assign", volunteerController.assignVolunteerToEvent);

module.exports = router;
