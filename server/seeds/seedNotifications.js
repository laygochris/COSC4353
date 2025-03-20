const mongoose = require("mongoose");
require("dotenv").config();
const notifs = require("../models/notifications.js");

const notificationsData = [
    {
      "id": 1712345678901,
      "userIDs": [1, 2, 3],
      "message": "Your event application has been approved!",
      "type": "success"
    },
    {
      "id": 1712345678902,
      "userIDs": [4, 5, 6],
      "message": "New volunteering event available!",
      "type": "info"
    },
    {
      "id": 1712345678903,
      "userIDs": [7, 8, 9],
      "message": "Reminder: Your shift starts in 1 hour.",
      "type": "warning"
    },
    {
      "id": 1712345678904,
      "userIDs": [10, 11, 1],
      "message": "An urgent event needs more volunteers!",
      "type": "danger"
    },
    {
      "id": 1712345678905,
      "userIDs": [2, 3, 4, 5],
      "message": "You have successfully signed up for a new event.",
      "type": "success"
    },
    {
      "id": 1712345678906,
      "userIDs": [6, 7, 8],
      "message": "Don't forget to submit your volunteer hours!",
      "type": "info"
    },
    {
      "id": 1712345678907,
      "userIDs": [9, 10, 11],
      "message": "Your feedback has been received, thank you!",
      "type": "success"
    },
    {
      "id": 1712345678908,
      "userIDs": [1, 5, 9],
      "message": "Your event starts in 30 minutes.",
      "type": "warning"
    },
    {
      "id": 1712345678909,
      "userIDs": [2, 6, 10],
      "message": "System maintenance scheduled for tonight.",
      "type": "danger"
    },
    {
      "id": 1712345678910,
      "userIDs": [3, 7, 11],
      "message": "Your profile has been updated successfully.",
      "type": "success"
    },
    {
      "id": 1712345678911,
      "userIDs": [4, 8, 1],
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