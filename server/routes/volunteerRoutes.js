const express = require('express');
const { createVolunteerValidation, matchVolunteersToEventValidation } = require('../validators/volunteerValidator');
const { getVolunteers, matchVolunteersToEvent, createVolunteer } = require('../controllers/volunteerController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.get('/', verifyToken, getVolunteers);
router.post('/create', verifyToken, createVolunteerValidation, createVolunteer);
router.get('/match/:volunteerId', verifyToken, matchVolunteersToEventValidation, matchVolunteersToEvent);

module.exports = router;
