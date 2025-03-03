// server/controllers/authController.js
const { validationResult } = require('express-validator');

const data = [
    {id: 1, email: 'test@example.com', password: 'password'},
    {id: 2, email: 'link@zelda.com', password: 'hyrule4ever'}
]

// controller for registration
exports.registerUser = (req, res) => {
  // checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  // check if user exists
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists.' });
  }

  // create new user
  const newUser = { id: Date.now(), email, password };
  users.push(newUser);

  res.status(201).json({
    message: 'User registered successfully!',
    user: newUser,
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
