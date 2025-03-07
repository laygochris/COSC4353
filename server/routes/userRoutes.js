const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const fs = require('fs');
const path = require('path');

// Path to users.json
const usersFilePath = path.join(__dirname, '../data/users.json');

// Helper function to load users dynamically
const loadUsers = () => {
  try {
    const dataBuffer = fs.readFileSync(usersFilePath);
    return JSON.parse(dataBuffer.toString());
  } catch (error) {
    console.error("Error loading users file:", error);
    return [];
  }
};

// Protected route for getting a user profile
router.get('/profile/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const users = loadUsers(); // ✅ Load users dynamically
  const user = users.find(user => user.id === userId);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

//Test route
router.get('/test', (req, res) => {
  console.log("HELLO I MADE IT HERE");
  res.json({ message: "HELLO I MADE IT HERE" });
});

module.exports = router;


// router.get('/test', (req, res) => {
//   console.log("HELLO I MADE IT HERE");
//   res.json({ message: "HELLO I MADE IT HERE" });
// });

