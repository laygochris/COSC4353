const express = require('express');
const router = express.Router();
const {
    updateUserProfile,
    getUserProfile,
    deleteUserProfile
} = require('../controllers/userProfileController');

// Update or create user profile
router.put('/update', updateUserProfile);

// Get user profile
router.get('/:userId', getUserProfile);

// Delete user profile
router.delete('/:userId', deleteUserProfile);

// Test route
router.get('/test', (req, res) => {
    console.log("User Profile Routes are working!");
    res.json({ message: "User Profile Routes are working!" });
});

module.exports = router;