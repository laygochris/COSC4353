const jwt = require('jsonwebtoken');
const users = require('../data/users.json');
const key = process.env.JWT_SECRET || 'yourSecretKey'; // Use environment variable for secret key

const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header (it should be in the format "Bearer tokenValue")
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  // Extract the token part from the header because it's in the format "Bearer <tokenValue>"
  const token = authHeader.split(' ')[1];

  // Verify the token using the secret key
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }

    // Find the user by decoded userID
    const user = users.find(user => user.id === decoded.userID);
    // console.log("TOKEN CHECKING USER:", user);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Attach user information to the request object
    req.user = user;
    req.message = 'Token verified successfully';
    console.log('Token verified successfully for user:', user.id); 
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = verifyToken;