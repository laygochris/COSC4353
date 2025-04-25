const express = require('express');
const { updateProfileValidation } = require('../validators/userProfileValidator');
const {
    updateUserProfile,
    getUserProfile
} = require('../controllers/userProfileController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Update user profile
router.put("/:id", verifyToken, updateUserProfile);

// Get user profile
router.get('/:userId', verifyToken, getUserProfile);

// Test route
router.get('/test', (req, res) => {
    console.log("User Profile Routes are working!");
    res.json({ message: "User Profile Routes are working!" });
});

module.exports = router;
