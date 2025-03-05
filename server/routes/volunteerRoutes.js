const express = require("express");
const { getVolunteers } = require("../controllers/volunteerController");
const router = express.Router();

router.get("/", getVolunteers); // This should handle GET /api/volunteers

module.exports = router;
