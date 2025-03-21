const express = require("express");
const router = express.Router();
const {
    getVolunteers,  
    matchVolunteersToEvent,
    getVolunteerById
} = require("../controllers/volunteerController");

router.get("/", getVolunteers);  // Should match the imported function name
router.get("/volunteer/:volunteerId", getVolunteerById);  // Same here
router.get("/match/:volunteerId", matchVolunteersToEvent);  // And here


module.exports = router;
