const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    required_skills: {
        type: [String],
        required: true,
    },
    urgency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignedVolunteers: {
        type: [Number],
        required: true,
    }
})

const events = mongoose.model("events", eventsSchema)
module.exports = events