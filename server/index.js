const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const User = require('./models/users');
const http = require("http");
const socketIo = require("socket.io");
const watchNewUser = require("./data/watchers/userWatcher");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

watchNewUser(io);
app.set("io", io);

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

// Wait until Mongo is connected before watching
mongoose.connection.once('open', () => {
  console.log('🔄 Watching for new users...');
  User.watch().on('change', (change) => {
    if (change.operationType === 'insert') {
      const newUser = change.fullDocument;
      console.log('👤 New user registered:', newUser.username);

      io.emit('userRegistered', {
        message: `🎉 ${newUser.username} has joined!`,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
        },
      });
    }
  });
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5001;

// Import the routes
const authRoutes = require('./routes/authRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const eventRoutes = require("./routes/eventRoutes");
const userRoutes = require("./routes/userRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const historyRoutes = require("./routes/historyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reportingRoutes = require("./routes/reportingRoutes"); // <-- Reporting routes added

// Mount the routes
app.use('/api', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/user-profile", userProfileRoutes);
app.use("/api/volunteer-history", historyRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reports", reportingRoutes); 


app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

server.listen(PORT, () => {
  console.log(`✅ Server + Socket.IO running at http://localhost:${PORT}`);
});

