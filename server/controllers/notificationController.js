const Notification = require("../models/notifications");

// GET: Fetch notifications for the logged-in user
const getUserNotifications = async (req, res) => {
  try {
    // Assume req.user.id is set by your verifyToken middleware as a string ObjectId
    const userId = req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }
    // Find notifications where the userIDs array contains the user's ObjectId
    const notifications = await Notification.find({ userIDs: userId });
    console.log(`Notifications for user ${userId}:`, notifications);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// DELETE: Dismiss a notification for the logged-in user
const dismissNotification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // `id` is your custom notification id
    // Find the notification by its custom id (converted to a number)
    const notification = await Notification.findOne({ id: parseInt(id) });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    // Remove the user's ObjectId from the userIDs array
    notification.userIDs = notification.userIDs.filter(
      uid => uid.toString() !== userId.toString()
    );
    // Save the updated notification (even if the array becomes empty)
    await notification.save();
    return res.json({ message: `Notification ${id} updated for user ${userId}.` });
  } catch (error) {
    console.error("Error dismissing notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST: Create a new notification for specified users
const createNotification = async (req, res) => {
  try {
    const { message, type, userIDs } = req.body;
    if (!message || !type || !userIDs || !Array.isArray(userIDs)) {
      return res.status(400).json({ message: "Message, type, and userIDs array are required" });
    }
    // Create a new notification with a custom id based on Date.now()
    const newNotification = await Notification.create({
      id: Date.now(),
      userIDs, // Ensure these are valid ObjectId strings
      message,
      type
    });
    res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getUserNotifications,
  dismissNotification,
  createNotification,
};
