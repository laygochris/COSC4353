const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    requiredSkills: { type: [String], required: true }, // ✅ Ensure it matches seed data
    urgency: { type: String, enum: ["low", "medium", "high", "very high"], required: true },
    status: { type: String, enum: ["completed", "upcoming", "canceled"], required: true },
    description: { type: String, required: true },
    assignedVolunteers: { type: [mongoose.Schema.Types.ObjectId], ref: "User", default: [] },
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
