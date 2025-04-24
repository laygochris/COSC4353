const mongoose = require("mongoose");
require("dotenv").config();
const Notification = require("../models/notifications.js");

const notificationsData = [
  {
    id: 1712345678999,
    userIDs: [],
    message: "🎉 Your account was created successfully!",
    type: "success",
    targetAudience: "newUser"
  },

  {
    id: 1712345678901,
    userIDs: ["6809beaca659f180fbf3d891", "6809beaca659f180fbf3d894"],
    message: "Your event application has been approved!",
    type: "success",
    targetAudience: "assigned"
  },
  {
    id: 1712345678902,
    userIDs: ["6809beaca659f180fbf3d891"],
    message: "New volunteering event available!",
    type: "info",
    targetAudience: "assigned"
  },
  {
    id: 1712345678903,
    userIDs: ["6809beaca659f180fbf3d894"],
    message: "Reminder: Your shift starts in 1 hour.",
    type: "warning",
    targetAudience: "assigned"
  },
  {
    id: 1712345678904,
    userIDs: [],
    message: "Don't forget to submit your volunteer hours!",
    type: "info",
    targetAudience: "volunteer"
  },
  {
    id: 1712345678905,
    userIDs: [],
    message: "System maintenance scheduled for tonight.",
    type: "danger",
    targetAudience: "allUsers"
  }
];

const seedNotifications = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");

    await Notification.deleteMany(); // Optional reset
    await Notification.insertMany(notificationsData);
    console.log("✅ Notifications seeded successfully!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding notifications:", error);
    process.exit(1);
  }
};

seedNotifications();
