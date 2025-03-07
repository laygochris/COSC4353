const { check } = require('express-validator');

const createVolunteerValidation = [
  check('firstName').notEmpty().withMessage('First name is required'),
  check('lastName').notEmpty().withMessage('Last name is required'),
  check('email').isEmail().withMessage('Valid email is required'),
  check('skills').isArray().withMessage('Skills must be an array'),
];

const matchVolunteersToEventValidation = [
  check('volunteerId').isInt().withMessage('Volunteer ID must be an integer'),
];

module.exports = {
  createVolunteerValidation,
  matchVolunteersToEventValidation,
};
