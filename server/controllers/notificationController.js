const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/notifications.json");

// Load notifications from JSON
const loadNotifications = () => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading notifications:", error);
    return [];
  }
};

// GET: Fetch notifications for the logged-in user
 const getUserNotifications = (req, res) => {
  const userID = req.user.id; 

  if (!userID) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  const notifications = loadNotifications(); 

  console.log(`User ID from token: ${userID}`);
  console.log(`All Notifications Before Filtering:`, JSON.stringify(notifications, null, 2));

  const userNotifications = notifications.filter(notification => 
    Array.isArray(notification.userIDs) && notification.userIDs.includes(userID)
  );

  console.log(`Filtered Notifications for user ${userID}:`, JSON.stringify(userNotifications, null, 2)); 

  res.json(userNotifications);
};



// DELETE: Dismiss a notification by ID (only if it belongs to the user)
const dismissNotification = (req, res) => {
  const userID = req.user.id;
  const { id } = req.params;

  let notifications = loadNotifications();

  const notificationIndex = notifications.findIndex(n => n.id === parseInt(id));

  if (notificationIndex === -1) {
    return res.status(404).json({ message: "Notification not found." });
  }

  notifications[notificationIndex].userIDs = notifications[notificationIndex].userIDs.filter(uid => uid !== userID);

  // If no users remain, delete the notification
  if (notifications[notificationIndex].userIDs.length === 0) {
    notifications.splice(notificationIndex, 1);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2));
  res.json({ message: `Notification ${id} dismissed for user ${userID}.` });
};


// POST: Create a notification for a specific user
const createNotification = (req, res) => {
  const { message, type, userID } = req.body;

  if (!message || !type || !userID) {
    return res.status(400).json({ message: "Message, type, and userID are required" });
  }

  let notifications = loadNotifications();

  const newNotification = {
    id: Date.now(),
    userID, 
    message,
    type,
  };

  notifications.push(newNotification);
  fs.writeFileSync(DATA_FILE, JSON.stringify(notifications, null, 2));

  res.status(201).json(newNotification);
};

// Ensure all functions are exported
module.exports = {
  getUserNotifications,
  dismissNotification,
  createNotification
};
