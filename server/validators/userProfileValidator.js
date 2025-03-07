const { check } = require('express-validator');

exports.updateProfileValidation = [
  check('firstName').optional().notEmpty().withMessage('First name is required'),
  check('lastName').optional().notEmpty().withMessage('Last name is required'),
  check('email').optional().isEmail().withMessage('Valid email is required'),
  check('username').optional().notEmpty().withMessage('Username is required'),
  check('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];