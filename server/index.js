const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ✅ Fix CORS Issue (Explicitly Allow React Frontend)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const PORT = process.env.PORT || 5001;

// Import the routes
const authRoutes = require('./routes/authRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const historyRoutes = require("./routes/historyRoutes"); 
const notificationRoutes = require("./routes/notificationRoutes"); 

// Mount the routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/volunteer-history", historyRoutes); 
app.use("/api/notifications", notificationRoutes);

// Simple test endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
