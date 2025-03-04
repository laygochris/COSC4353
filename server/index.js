const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Example route

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  console.log('Root URL accessed');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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
