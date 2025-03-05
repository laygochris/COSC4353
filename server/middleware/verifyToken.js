const jwt = require('jsonwebtoken');
const key = 'yourSecretKey'; // Use the same secret key as in your login

// HTTP Headers are extra pieces of information that accompany a web request (or response).
// They are like the envelope of a letter—they provide details about the contents or the sender without being part of the main message.
// Examples include headers that specify the type of data being sent (like JSON), the language, caching policies, and so on.
//authorization header: type of HTTP header used to send credentials to server
// example: Authorization: Bearer <your_token_here>
const verifyToken = (req, res, next) => {
  // Get the token from the Authorization header (it should be in the format "Bearer tokenValue")
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  // Extract the token part from the header cause its Bearer <tokenValue>
  const token = authHeader.split(' ')[1];

  // Verify the token using the secret key
  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    // Save the decoded user info (for example, userId) to the request object
    req.userId = decoded.userId;
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = verifyToken;

//so for part2, whenever we go to a part of the website that needs authentication,
//  we send it with a header and with middleware it takes that header with the token and 
// verifries it to ensure the user that is sending that http request has access to that data

