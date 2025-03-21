const mongoose = require("mongoose");

const notificationsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    userIDs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }],
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
})

const notifications = mongoose.model("notifications", notificationsSchema)
module.exports = notifications