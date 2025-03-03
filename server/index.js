const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

// Import the routes
const authRoutes = require('./routes/authRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const eventRoutes = require("./routes/eventRoutes");

// Mount the routes
app.use('/api', authRoutes);  
app.use("/api/volunteers", volunteerRoutes); 
app.use("/api/events", eventRoutes);

// Simple test endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
