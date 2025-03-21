const mongoose = require("mongoose");
const Event = require("../models/events");
const User = require("../models/users");

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error("❌ Error fetching events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get event by ID
exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ObjectId format for event" });
        }

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: "Event not found" });

        res.json(event);
    } catch (error) {
        console.error("❌ Error fetching event:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Assign a volunteer to an event using ObjectId
exports.assignVolunteerToEvent = async (req, res) => {
    try {
        const { volunteerId, eventId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(volunteerId) || !mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid ObjectId format for volunteer or event" });
        }

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

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
