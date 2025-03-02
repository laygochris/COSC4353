const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Route for login
router.post('/login', login);

module.exports = router;
