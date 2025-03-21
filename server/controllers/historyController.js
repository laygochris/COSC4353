const mongoose = require("mongoose");
const Event = require("../models/events"); // ✅ Matches provided events.js
const User = require("../models/users"); // ✅ Matches provided users.js

// Get all events (for debugging)
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get volunteer history by ObjectId
exports.getVolunteerHistory = async (req, res) => {
    try {
        const { userId } = req.params; // Get ObjectId from route parameter

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "Invalid ObjectId format" });
        }

        console.log(`📌 Fetching volunteer history for ObjectId: ${userId}`);

        // Find all events where this user has been assigned
        const userEvents = await Event.find({ assignedVolunteers: userId });
        
        if (!userEvents.length) {
            return res.status(404).json({ message: "No volunteer history found for this user" });
        }

        res.json(userEvents);
    } catch (error) {
        console.error("❌ Error fetching volunteer history:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Assign a volunteer to an event using ObjectId
exports.assignVolunteerToEvent = async (req, res) => {
    try {
        const { volunteerId, eventId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(volunteerId) || !mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid volunteer ID or event ID" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (!event.assignedVolunteers.includes(volunteerId)) {
            event.assignedVolunteers.push(volunteerId);
            await event.save();
            console.log(`✅ Volunteer ${volunteerId} assigned to event ${eventId}`);
        } else {
            console.warn(`⚠️ Volunteer ${volunteerId} is already assigned to event ${eventId}`);
        }

        res.json({ message: `Volunteer ${volunteerId} assigned to event ${eventId}`, event });
    } catch (error) {
        console.error("❌ Error assigning volunteer to event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

