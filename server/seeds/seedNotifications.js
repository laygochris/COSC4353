const mongoose = require("mongoose");
require("dotenv").config();
const notifs = require("../models/notifications.js");

const notificationsData = [
    {
      "id": 1712345678901,
      "userIDs": ["67dca2c970c8666e6f4442ee", "67dca2c970c8666e6f4442f1", "67dca2c970c8666e6f4442f4"],
      "message": "Your event application has been approved!",
      "type": "success"
    },
    {
      "id": 1712345678902,
      "userIDs": ["67dca2c970c8666e6f4442ee", "67dca2c970c8666e6f4442f1", "67dca2c970c8666e6f4442f4"],
      "message": "New volunteering event available!",
      "type": "info"
    },
    {
      "id": 1712345678903,
      "userIDs": ["67dca2c970c8666e6f4442ee", "67dca2c970c8666e6f4442f1", "67dca2c970c8666e6f4442f4"],
      "message": "Reminder: Your shift starts in 1 hour.",
      "type": "warning"
    },
    {
      "id": 1712345678904,
      "userIDs": ["67dca2c970c8666e6f4442ee", "67dca2c970c8666e6f4442f4"],
      "message": "An urgent event needs more volunteers!",
      "type": "danger"
    },
    {
      "id": 1712345678905,
      "userIDs": [],
      "message": "You have successfully signed up for a new event.",
      "type": "success"
    },
    {
      "id": 1712345678906,
      "userIDs": [],
      "message": "Don't forget to submit your volunteer hours!",
      "type": "info"
    },
    {
      "id": 1712345678907,
      "userIDs": [],
      "message": "Your feedback has been received, thank you!",
      "type": "success"
    },
    {
      "id": 1712345678908,
      "userIDs": [],
      "message": "Your event starts in 30 minutes.",
      "type": "warning"
    },
    {
      "id": 1712345678909,
      "userIDs": [],
      "message": "System maintenance scheduled for tonight.",
      "type": "danger"
    },
    {
      "id": 1712345678910,
      "userIDs": [],
      "message": "Your profile has been updated successfully.",
      "type": "success"
    },
    {
      "id": 1712345678911,
      "userIDs": [],
      "message": "A new training session is available for registration.",
      "type": "info"
    }
  ]
  
  const seedNotifications = async () => {
    try {
      // Connect to MongoDB Atlas
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected to MongoDB Atlas");
  
      // Insert data
      await notifs.insertMany(notificationsData);
      console.log("Notifications seeded successfully!");
  
      // Exit the process
      process.exit(0);
    } catch (error) {
      console.error("Error seeding notifications:", error);
      process.exit(1);
    }
  };
  
  seedNotifications();