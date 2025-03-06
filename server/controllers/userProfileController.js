const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

// File path to the JSON
const filePath = path.join(__dirname, '../data/userProfile.json');

// Helper function to load user profiles
const loadProfiles = () => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        if (dataJSON.trim() === "") {
            console.error("Error: userProfiles.json file is empty.");
            return [];
        }
        return JSON.parse(dataJSON);
    } catch (error) {
        console.error("Error reading user profiles file:", error);
        return [];
    }
};

// Helper function to save user profiles
const saveProfiles = (profiles) => {
    fs.writeFileSync(filePath, JSON.stringify(profiles, null, 2));
};

// Create or Update User Profile
exports.updateUserProfile = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, fullName, address, city, state, zip, skills, preference, availability } = req.body;

    let profiles = loadProfiles();

    let existingProfile = profiles.find((p) => p.userId === userId);
    if (existingProfile) {
        // Update existing profile
        existingProfile.fullName = fullName || existingProfile.fullName;
        existingProfile.address = address || existingProfile.address;
        existingProfile.city = city || existingProfile.city;
        existingProfile.state = state || existingProfile.state;
        existingProfile.zip = zip || existingProfile.zip;
        existingProfile.skills = skills || existingProfile.skills;
        existingProfile.preference = preference || existingProfile.preference;
        existingProfile.availability = availability || existingProfile.availability;
    } else {
        const newProfile = { userId, fullName, address, city, state, zip, skills, preference, availability };
        profiles.push(newProfile);
    }

    saveProfiles(profiles);

    return res.status(200).json({
        message: 'User profile updated successfully!',
        profile: existingProfile || profiles.find(p => p.userId === userId),
    });
};

// Get User Profile
exports.getUserProfile = (req, res) => {
    const { userId } = req.params;
    const profiles = loadProfiles();
    const userProfile = profiles.find((p) => p.userId === userId);

    if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found.' });
    }

    return res.json({
        message: 'User profile retrieved successfully!',
        profile: userProfile,
    });
};

// Delete User Profile
exports.deleteUserProfile = (req, res) => {
    const { userId } = req.params;
    let profiles = loadProfiles();

    const updatedProfiles = profiles.filter((p) => p.userId !== userId);
    if (profiles.length === updatedProfiles.length) {
        return res.status(404).json({ message: 'User profile not found.' });
    }

    saveProfiles(updatedProfiles);

    return res.json({
        message: 'User profile deleted successfully!',
    });
};
