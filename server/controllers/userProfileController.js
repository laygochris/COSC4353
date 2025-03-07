const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');

// File path to `users.json`
const filePath = path.join(__dirname, '../data/users.json');

// Helper function to load users
const loadUsers = () => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        if (dataJSON.trim() === "") {
            return [];
        }
        return JSON.parse(dataJSON);
    } catch (error) {
        return [];
    }
};

// Helper function to save users
const saveUsers = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Get User Profile
exports.getUserProfile = (req, res) => {
    const { userId } = req.params;

    const users = loadUsers();

    const userProfile = users.find((u) => u.id === parseInt(userId, 10));

    if (!userProfile) {
        return res.status(404).json({ message: 'User profile not found in users.json.' });
    }

    return res.json({
        message: 'User profile retrieved successfully!',
        profile: userProfile
    });
};

exports.updateUserProfile = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(`⚠️ Validation errors:`, errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, fullName, address, city, state, zip, skills, preference, availability } = req.body;

    let users = loadUsers();

    let existingUser = users.find((u) => u.id === parseInt(userId, 10));

    if (!existingUser) {
        return res.status(404).json({ message: 'User not found in users.json.' });
    }


    // update
    existingUser.firstName = fullName.split(" ")[0] || existingUser.firstName;
    existingUser.lastName = fullName.split(" ")[1] || existingUser.lastName;
    existingUser.address = address || existingUser.address;
    existingUser.city = city || existingUser.city;
    existingUser.state = state || existingUser.state;
    existingUser.zip = zip || existingUser.zip;
    existingUser.skills = skills || existingUser.skills;
    existingUser.preference = preference || existingUser.preference;
    existingUser.availability = availability || existingUser.availability;

    saveUsers(users);

    return res.status(200).json({
        message: 'User profile updated successfully!',
        profile: existingUser,
    });
};

// Delete User Profile
exports.deleteUserProfile = (req, res) => {
    const { userId } = req.params;

    let users = loadUsers();

    const updatedUsers = users.filter((u) => u.id !== parseInt(userId, 10));

    if (users.length === updatedUsers.length) {
        return res.status(404).json({ message: 'User profile not found in users.json.' });
    }

    saveUsers(updatedUsers);

    return res.json({
        message: 'User profile deleted successfully!',
    });
};
