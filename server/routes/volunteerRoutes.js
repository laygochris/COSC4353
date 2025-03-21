const express = require("express");
const router = express.Router();
const {
    getVolunteers,  
    getVolunteerByEmail,
    matchVolunteersToEvent,
    createVolunteer,
    getVolunteerById
} = require("../controllers/volunteerController");

router.get("/", getVolunteers);  // Should match the imported function name
router.get("/volunteer/email", getVolunteerByEmail);  // Same here
router.get("/volunteer/:volunteerId", getVolunteerById);  // Same here
router.get("/match/:volunteerId", matchVolunteersToEvent);  // And here
router.post("/volunteer", createVolunteer);  // Lastly here


module.exports = router;
