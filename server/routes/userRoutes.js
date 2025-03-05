const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const users = require('../data/users.json');

// Protected route for getting a user profile
router.get('/profile/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(user => user.id === userId);
  if (user) {
    console.log(req.message);
    console.log("THIS IS THE USER:", user); // Access the message attached to the request object
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// Test route to check if the API reaches this route
router.get('/test', (req, res) => {
  console.log("HELLO I MADE IT HERE");
  res.json({ message: "HELLO I MADE IT HERE" });
});

module.exports = router;
