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
    const { userId } = req.params; // ✅ change this line
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
      const {
        fullName,
        address,
        city,
        state,
        zipcode,
        skills,
        preferences,
        availability
      } = req.body;
  
      const user = await User.findById(userId); // userId from params
      if (!user) {
        return res.status(404).json({ message: 'User not found in database.' });
      }
  
      // Update fields
      user.fullName = fullName || user.fullName;
      user.address = address || user.address;
      user.city = city || user.city;
      user.state = state || user.state;
      user.zipcode = zipcode || user.zipcode;
      user.skills = skills || user.skills;
      user.preferences = preferences || user.preferences;
      user.availability = availability || user.availability;
  
      await user.save();
  
      return res.status(200).json({
        message: 'User profile updated successfully!',
        profile: user,
      });
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
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
