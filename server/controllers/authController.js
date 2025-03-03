// server/controllers/authController.js
const { validationResult } = require('express-validator');

const users = [
    {id: 1, firstName: 'John', lastName: 'Doe', username: 'jd', email: 'test@example.com', password: 'password'},
    {id: 2, firstName: 'Link', lastName: 'Link', username: 'Hero', email: 'link@hyrule.com', password: 'zelda4ever'}
]

// controller for registration
exports.registerUser = (req, res) => {
  // checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, username, email, password } = req.body;

  // check if user exists
  const existingUser = users.find((u) => u.email === email || u.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  // create new user
  const newUser = { id: Date.now(), firstName, lastName, username, email, password };
  users.push(newUser);

  res.status(201).json({
    message: 'User registered successfully!',
    user: username,
  });
};

// controller for user login
exports.loginUser = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // look for user in data
  const foundUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  res.json({
    message: 'Login successful!',
    user: foundUser,
  });
};
