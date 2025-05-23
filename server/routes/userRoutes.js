const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const User = require("../models/users");

// Protected route for getting a user profile
router.get('/profile/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Use the user ID from the middleware

    console.log("Trying to find user with ID:", userId);

    const user = await User.findById(userId); // Pass userId directly
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Test route
router.get('/test', (req, res) => {
  console.log("HELLO I MADE IT HERE");
  res.json({ message: "HELLO I MADE IT HERE" });
});

module.exports = router;
