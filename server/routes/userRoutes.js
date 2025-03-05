//set up routers that we can attatch routes to
const express = require('express');
const router = express.Router();

//import middleware
const verifyToken = require('../middleware/verifyToken');

// Protected route for getting a user profile
//
router.get('/profile/:id', verifyToken, (req, res) => {
    res.json({ message: 'It worked!' });
});

module.exports = router;
