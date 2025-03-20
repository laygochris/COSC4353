const express = require("express");
const router = express.Router();
const volunteerController = require("../controllers/volunteerController");

router.get("/", volunteerController.getVolunteers);
router.get("/:id", volunteerController.getVolunteerById);

module.exports = router;
