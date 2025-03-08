const jwt = require("jsonwebtoken");
const users = require("../data/users.json");
const key = process.env.JWT_SECRET || "yourSecretKey"; 

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Authorization Header:", authHeader); 

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1]; 
  console.log("Extracted Token:", token); 

  jwt.verify(token, key, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err); 
      return res.status(401).json({ message: "Failed to authenticate token." });
    }

    console.log("Decoded Token Data:", decoded); // ✅ Log the decoded token

    // ✅ Ensure `userID` exists in the decoded token
    if (!decoded.userID) {
      return res.status(401).json({ message: "Invalid token: userID missing." });
    }

    const user = users.find((user) => user.id === decoded.userID);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // ✅ Only attach userID to `req.user`
    req.user = { id: user.id }; 
    console.log("Token verified successfully for user ID:", user.id); 

    next();
  });
};

module.exports = verifyToken;
