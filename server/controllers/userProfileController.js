const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const User = require('../models/users.js');

// GET user profile
exports.getUserProfile = async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    try {
        const userProfile = await User.findById(userId);
        if (!userProfile) {
            return res.status(404).json({ message: 'User profile not found in database.' });
        }

        return res.json({
            message: 'User profile retrieved successfully!',
            profile: userProfile
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// UPDATE user profile
exports.updateUserProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(`⚠️ Validation errors:`, errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        userId,
        fullName,
        address,
        city,
        state,
        zip,
        skills,
        preference,
        availability
    } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found in database.' });
        }

        if (fullName) {
            user.firstName = fullName.split(" ")[0] || user.firstName;
            user.lastName = fullName.split(" ")[1] || user.lastName;
        }

        user.address = address || user.address;
        user.city = city || user.city;
        user.state = state || user.state;
        user.zip = zip || user.zip;
        user.skills = skills || user.skills;
        user.preference = preference || user.preference;
        user.availability = availability || user.availability;

        await user.save();

        return res.status(200).json({
            message: 'User profile updated successfully!',
            profile: user,
        });
    } catch (error) {
        console.error('Error updating user profile:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};

// DELETE user profile
exports.deleteUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User profile not found in database.' });
        }

        return res.json({
            message: 'User profile deleted successfully!',
        });
    } catch (error) {
        console.error('Error deleting user profile:', error);
        return res.status(500).json({ message: 'Server error.' });
    }
};
