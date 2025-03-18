const fs = require("fs");
const path = require("path");

// File path for storing events
const eventsFilePath = path.join(__dirname, "../data/events.json");

// ✅ Helper function to read events
const readEvents = () => {
    try {
        const data = fs.readFileSync(eventsFilePath, "utf8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading events file:", error);
        return [];
    }
};

const saveEvents = (events) => {
    try {
        fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 2), "utf8");
    } catch (error) {
        console.error("Error saving events file:", error);
    }
};

exports.getEvents = (req, res) => {
    const events = readEvents();
    if (!Array.isArray(events)) {
        return res.status(500).json({ message: "Invalid events data format" });
    }
    res.json(events);
};

exports.getEventById = (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const events = readEvents();
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
};

exports.createEvent = (req, res) => {
    const { name, location, date, description, required_skills } = req.body;

    if (!name || !location || !date || !description || !required_skills) {
        return res.status(400).json({ message: "Missing required event fields" });
    }

    const events = readEvents();
    const newEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        name,
        location,
        date,
        description,
        required_skills,
        assignedVolunteers: [] 
    };

    events.push(newEvent);
    saveEvents(events);

    res.status(201).json(newEvent);
};

exports.matchVolunteerToEvent = (req, res) => {
    const { volunteerId, eventId } = req.body;

    console.log(`Received request to match Volunteer ID: ${volunteerId} with Event ID: ${eventId}`);

    if (!volunteerId || !eventId) {
        return res.status(400).json({ message: "Volunteer ID and Event ID are required" });
    }

    let events = readEvents();
    
    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) {
        console.error(`Event with ID ${eventId} not found`);
        return res.status(404).json({ message: "Event not found." });
    }

    console.log(`Found Event:`, events[eventIndex]);

    if (!Array.isArray(events[eventIndex].assignedVolunteers)) {
        events[eventIndex].assignedVolunteers = [];
    }
    
    if (!events[eventIndex].assignedVolunteers.includes(volunteerId)) {
        events[eventIndex].assignedVolunteers.push(volunteerId);
        console.log(`Volunteer ID ${volunteerId} added to event ${eventId}`);
    } else {
        console.warn(`Volunteer ID ${volunteerId} is already assigned to event ${eventId}`);
    }

    saveEvents(events);
    console.log("Updated Events.json Successfully!");
    res.json(events[eventIndex]); 
};
