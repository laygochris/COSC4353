const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET || 'yourSecretKey';
const UserCredential = require('../models/users.js');
const UserProfile = require('../models/volunteers.js');

exports.registerUser = async (req, res) => {
  // Validate incoming data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, firstName, lastName, email, password } = req.body;

  try {
    // Check if a user already exists with the same username or email
    const existingCredential = await UserCredential.findOne({
      $or: [{ username }, { email }]
    });
    if (existingCredential) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Create the user credential document (password will be hashed via pre-save hook)
    const newCredential = new UserCredential({
      username,
      email,
      password
    });
    await newCredential.save();

    // VOLUNTEER TABLE
    const newProfile = new UserProfile({
      user: newCredential._id,
      fullName: '${firstName} ${lastName}',
      email: email,
      // Leave address, city, state, zipcode, skills, preferences, availability as defaults (empty)
    });
    await newProfile.save();

    return res.status(201).json({
      message: 'User registered successfully!',
      userCredential: newCredential,
      userProfile: newProfile
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Login 
exports.loginUser = async (req, res) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } 

  const { email, password } = req.body;

  try {
    // Find a user with the matching email
    const foundUser = await UserCredential.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // check if decrypted password matches
    const bcrypt = require('bcrypt');
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }


    // Sign a token (again, note: in production, don't include sensitive info like plain passwords)
    const token = jwt.sign(
      { userID: foundUser._id, email: foundUser.email },
      key,
      { expiresIn: "1hr" }
    );

    return res.json({
      message: 'Login successful!',
      user: foundUser,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
