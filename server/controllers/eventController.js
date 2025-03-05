const fs = require("fs");
const path = require("path");

// File path for storing events
const eventsFilePath = path.join(__dirname, "../data/events.json");

// Helper function to read events
const readEvents = () => {
    try {
        const data = fs.readFileSync(eventsFilePath, "utf8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error reading events file:", error);
        return [];
    }
};

// Get all events
exports.getEvents = (req, res) => {
    const events = readEvents();
    if (!Array.isArray(events)) {
        return res.status(500).json({ message: "Invalid events data format" });
    }
    res.json(events);
};

// Get a single event by ID
exports.getEventById = (req, res) => {
    const eventId = parseInt(req.params.id, 10);
    const events = readEvents();
    const event = events.find(e => e.id === eventId);

    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
};

// Create a new event
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
        required_skills
    };

    events.push(newEvent);
    fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 4), "utf8");

    res.status(201).json(newEvent);
};
