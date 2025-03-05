const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const users = require('../data/users.json');

// Protected route for getting a user profile
router.get('/profile/:id', verifyToken, (req, res) => {
  const userId = parseInt(req.params.id, 10);
  const user = users.find(user => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
