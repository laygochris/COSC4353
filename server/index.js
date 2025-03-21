const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
require('dotenv').config();
const path = require('path');
const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    process.exit(1); 
  }
};

connectDB(); 

// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

const PORT = process.env.PORT || 5001;

// import the routes
const authRoutes = require('./routes/authRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const historyRoutes = require("./routes/historyRoutes"); 
const notificationRoutes = require("./routes/notificationRoutes"); 

// mount the routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/volunteer-history", historyRoutes);
app.use("/api/notifications", notificationRoutes);

// simple test endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
