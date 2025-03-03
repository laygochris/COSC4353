const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// POST route for user registration
router.post('/register', (req, res) => {
    // get username and password from the request body
    const { username, password } = req.body;

    res.json({
        message: "User created successfully",
        user: {username, password}
    });
});

// POST route for user login
router.post('/login', (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body;
  
    // Simulate login logic
    if (username && password) {
      res.json({
        message: 'Login successful!',
        user: { username }
      });
    } else {
      res.status(400).json({
        message: 'Missing username or password'
      });
    }
  });

module.exports = router;
