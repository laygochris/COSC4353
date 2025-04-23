const User = require("../../models/users");
const Notification = require("../../models/notifications");

module.exports = function watchNewUser(io) {
  const db = require("mongoose").connection;

  db.once("open", () => {
    console.log("👁️ Watching for new user registrations...");

    User.watch().on("change", async (change) => {
      if (change.operationType === "insert") {
        const newUser = change.fullDocument;
        console.log(`🆕 New user: ${newUser.username}`);

        // 1. Find ONLY the welcome notification (not all newUser ones)
        const welcomeNotif = await Notification.findOne({
          userIDs: [],
          targetAudience: "newUser",
          message: "🎉 Your account was created successfully!"
        });

        // 2. If it exists, assign it to the new user and emit it
        if (welcomeNotif) {
          welcomeNotif.userIDs.push(newUser._id);
          await welcomeNotif.save();

          io.emit("notificationAssigned", {
            userID: newUser._id,
            message: welcomeNotif.message,
            type: welcomeNotif.type,
            id: welcomeNotif.id
          });

          console.log(`✅ Assigned welcome notif to ${newUser.username}`);
        } else {
          console.warn("⚠️ No welcome notification found to assign.");
        }
      }
    });
  });
};
