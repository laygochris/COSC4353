const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/users.js');

// GET user profile
const getUserProfile = async (req, res) => {
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
const updateUserProfile = async (req, res) => {
    try {
      const userId = req.params.id;
  
      console.log("Token user ID:", req.user.id);
      console.log("Param user ID:", userId);
  
      if (!req.user || String(req.user.id) !== String(userId)) {
        console.log("❌ Blocked update: user mismatch");
        return res.status(403).json({ error: "Unauthorized access" });
      }         
  
      const {
        fullName,
        address,
        city,
        state,
        zipcode,
        skills,
        preferences,
        availability,
      } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          address,
          city,
          state,
          zipcode,
          skills,
          preferences,
          availability,
        },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("❌ Error updating user profile:", error);
      res.status(500).json({ error: "Server error" });
    }
  };  

module.exports = {
    getUserProfile,
    updateUserProfile
  };