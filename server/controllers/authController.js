const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET || 'yourSecretKey';


// Path to the JSON file
const filePath = path.join(__dirname, '../data/users.json');

// Helper function to load users
const loadUsers = () => {
  try {
    // console.log("Attempting to read file from path:", filePath); // Debugging line
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    // console.log("Data read from file:", dataJSON); // Debugging line
    if (dataJSON.trim() === "") {
      console.error("Error: users.json file is empty."); // Debugging line
      return [];
    }
    return JSON.parse(dataJSON);
  } catch (error) {
    console.error("Error reading users file:", error); // Debugging line
    return [];
  }
};

// Helper function to save users
const saveUsers = (users) => {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
};

// Register User Controller
exports.registerUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Extract required fields
  const { firstName, lastName, email, username, password } = req.body;

  // Load current users from file
  let users = loadUsers();
  // console.log(users);

  // Check for duplicate username or email
  const existingUser = users.find(
    (u) => u.username === username || u.email === email
  );
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  // Create a new user object
  const newUser = { 
    id: Date.now(), 
    firstName, 
    lastName, 
    email, 
    username, 
    password,
    userType: 'user',
    skills: []
  };

  // Add new user to the users array
  users.push(newUser);

  // Save the updated users array to the file
  saveUsers(users);

  return res.status(201).json({
    message: 'User registered successfully!',
    user: newUser,
  });
};

// Login User Controller
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const users = require('../data/users.json');

  const foundUser = users.find(user => user.email === email && user.password === password);
  if (!foundUser) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    { userID: foundUser.id, email: foundUser.email },
    key,
    { expiresIn: "1hr" }
  );
  return res.json({
    message: 'Login successful!',
    user: foundUser,
    token: token
  });
};