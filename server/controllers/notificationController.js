const fs = require("fs");
const path = require("path");

const notificationsFilePath = path.join(__dirname, "../data/notifications.json");

// Helper function to read notifications
const readNotifications = () => {
  try {
    if (!fs.existsSync(notificationsFilePath)) {
      fs.writeFileSync(notificationsFilePath, "[]", "utf8");
    }
    const data = fs.readFileSync(notificationsFilePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading notifications file:", err);
    return [];
  }
};

// Helper function to write notifications
const writeNotifications = (notifications) => {
  try {
    fs.writeFileSync(notificationsFilePath, JSON.stringify(notifications, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing notifications file:", err);
  }
};

// Get all notifications
const getNotifications = (req, res) => {
  res.json(readNotifications());
};

// Add a new notification
const addNotification = (req, res) => {
  const notifications = readNotifications();
  const newNotification = {
    id: Date.now(),
    message: req.body.message,
    type: req.body.type || "info",
  };
  notifications.push(newNotification);
  writeNotifications(notifications);
  res.status(201).json(newNotification);
};

// Remove a notification
const deleteNotification = (req, res) => {
  let notifications = readNotifications();
  notifications = notifications.filter(notification => notification.id !== parseInt(req.params.id));
  writeNotifications(notifications);
  res.status(204).send();
};

module.exports = { getNotifications, addNotification, deleteNotification };
