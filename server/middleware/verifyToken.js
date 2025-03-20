const jwt = require("jsonwebtoken");
const key = process.env.JWT_SECRET || "yourSecretKey";
const UserCredential = require("../models/users.js");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "No token provided." });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token:", token);

  jwt.verify(token, key, async (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(401).json({ message: "Failed to authenticate token." });
    }

    console.log("Decoded Token Data:", decoded);

    if (!decoded.userID) {
      return res.status(401).json({ message: "Invalid token: userID missing." });
    }

    try {
      // Query the database for the user using the _id from the token
      const user = await UserCredential.findById(decoded.userID);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      // Attach the user info to the request object
      req.user = { id: user._id };
      console.log("Token verified successfully for user ID:", user._id);
      next();
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

module.exports = verifyToken;
