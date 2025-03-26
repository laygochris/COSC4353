const mongoose = require("mongoose");
const Event = require("../models/events");
const User = require("../models/users");

// Create event
exports.createEvent = async (req, res) => {
    try {
        const { name, description, location, requiredSkills, urgency, date, status } = req.body;
        // Validate required fields
        if (!name || !description || !location || !requiredSkills || !urgency || !date) {
            return res.status(400).json({ message: "Missing required event fields" });
        }
        // Use provided status or default to "upcoming"
        const eventStatus = status || "upcoming";
        const eventDate = new Date(date)
        
        const newEvent = new Event({
            name,
            description,
            location,
            requiredSkills,
            urgency,
            date: eventDate,
            status: eventStatus,
            assignedVolunteers: []
        });
        await newEvent.save();
        return res.status(201).json({ message: "Event created successfully!", event: newEvent });
    } catch (error) {
        console.error("❌ Error creating event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

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

// Update event (mimics updateUserProfile functionality)
exports.updateEvent = async (req, res) => {
    try {
        const { eventId, name, description, location, date, requiredSkills, urgency, status } = req.body;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid ObjectId format for event" });
        }
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        // Update fields if provided
        if (name) event.name = name;
        if (description) event.description = description;
        if (location) event.location = location;
        if (date) event.date = date;
        if (requiredSkills) event.requiredSkills = requiredSkills;
        if (urgency) event.urgency = urgency;
        if (status) event.status = status;
        await event.save();
        return res.status(200).json({ message: "Event updated successfully!", event });
    } catch (error) {
        console.error("❌ Error updating event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Delete event (mimics deleteUserProfile functionality)
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({ message: "Invalid ObjectId format for event" });
        }
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        return res.status(200).json({ message: "Event deleted successfully!" });
    } catch (error) {
        console.error("❌ Error deleting event:", error);
        return res.status(500).json({ message: "Internal server error" });
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