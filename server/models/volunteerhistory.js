const mongoose = require("mongoose");

const volunteerHistorySchema = new mongoose.Schema({
    volunteer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    eventName: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    required_skills: { type: [String], required: true },
    urgency: { type: String, enum: ["low", "medium", "high"], required: true },
    status: { type: String, enum: ["upcoming", "in-progress", "completed", "canceled"], required: true },
    date: { type: Date, required: true }
});

const VolunteerHistory = mongoose.model("VolunteerHistory", volunteerHistorySchema);
module.exports = VolunteerHistory;
