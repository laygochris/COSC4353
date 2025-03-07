const express = require('express');
const { updateProfileValidation } = require('../validators/userProfileValidator');
const {
    updateUserProfile,
    getUserProfile,
    deleteUserProfile
} = require('../controllers/userProfileController');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// Update or create user profile
router.put('/update', verifyToken, updateProfileValidation, updateUserProfile);

// Get user profile
router.get('/:userId', verifyToken, getUserProfile);

// Delete user profile
router.delete('/:userId', verifyToken, deleteUserProfile);

// Test route
router.get('/test', (req, res) => {
    console.log("User Profile Routes are working!");
    res.json({ message: "User Profile Routes are working!" });
});

module.exports = router;