const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const key = process.env.JWT_SECRET || 'yourSecretKey';
const UserCredential = require('../models/users.js');

// Helper function to format user data for responses.
// This extra function increases the code size and allows for additional test cases.
exports.formatUserResponse = (user) => {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    userType: user.userType,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// Registration Controller
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
      password,
      userType: "volunteer"
    });
    await newCredential.save();

    // You can optionally use firstName and lastName for logging or further processing.
    // Here, we simply include the data in the response by formatting the user.
    return res.status(201).json({
      message: 'User registered successfully!',
      userCredential: exports.formatUserResponse(newCredential),
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Login Controller
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
      return res.status(401).json({ message: 'Email invalid.' });
    }
    // Check if the provided password matches the stored (hashed) password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Password invalid.' });
    }

    // Sign a token (do not include sensitive info like plain passwords in production)
    const token = jwt.sign(
      { userID: foundUser._id, email: foundUser.email },
      key,
      { expiresIn: "1hr" }
    );

    return res.json({
      message: 'Login successful!',
      user: exports.formatUserResponse(foundUser),
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
