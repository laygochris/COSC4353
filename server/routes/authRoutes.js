const express = require('express');
const { registerValidation, loginValidation } = require('../validators/logregValidator');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

module.exports = router;

