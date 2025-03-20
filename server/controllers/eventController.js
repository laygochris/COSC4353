const Event = require("../models/events.js");

// ✅ Get all events from MongoDB
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error fetching events" });
    }
};

// ✅ Get a single event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.json(event);
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ message: "Server error fetching event" });
    }
};

// ✅ Create a new event in MongoDB
exports.createEvent = async (req, res) => {
    try {
        const { name, location, date, description, required_skills } = req.body;

        if (!name || !location || !date || !description || !required_skills) {
            return res.status(400).json({ message: "Missing required event fields" });
        }

        const newEvent = new Event({
            name,
            location,
            date,
            description,
            required_skills,
            assignedVolunteers: []
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Server error creating event" });
    }
};

// ✅ Assign a volunteer to an event
exports.matchVolunteerToEvent = async (req, res) => {
    try {
        const { volunteerId, eventId } = req.body;

        if (!volunteerId || !eventId) {
            return res.status(400).json({ message: "Volunteer ID and Event ID are required" });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Prevent duplicate assignments
        if (!event.assignedVolunteers.includes(volunteerId)) {
            event.assignedVolunteers.push(volunteerId);
            await event.save();
            console.log(`✅ Volunteer ${volunteerId} assigned to Event ${eventId}`);
        } else {
            console.warn(`⚠️ Volunteer ${volunteerId} is already assigned to Event ${eventId}`);
        }

        res.json(event);
    } catch (error) {
        console.error("Error assigning volunteer:", error);
        res.status(500).json({ message: "Server error assigning volunteer" });
    }
};
