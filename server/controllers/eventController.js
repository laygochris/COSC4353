const fs = require('fs');
const path = require('path');

// Path to the events.json file
const eventsFilePath = path.join(__dirname, '../data/events.json');

// Helper function to read events from the file
const readEventsFromFile = () => {
    try {
        const data = fs.readFileSync(eventsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading events.json:", error);
        return [];
    }
};

// Helper function to write events to the file
const writeEventsToFile = (events) => {
    try {
        fs.writeFileSync(eventsFilePath, JSON.stringify(events, null, 4), 'utf8');
    } catch (error) {
        console.error("Error writing to events.json:", error);
    }
};

// Get all events
exports.getEvents = (req, res) => {
    const events = readEventsFromFile();
    res.json(events);
};

// Get a single event by ID
exports.getEventById = (req, res) => {
    const eventId = parseInt(req.params.id);
    const events = readEventsFromFile();
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

    const events = readEventsFromFile();

    const newEvent = {
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        name,
        location,
        date,
        description,
        required_skills,
        assignedVolunteers: []  // Default empty array for volunteer assignments
    };

    events.push(newEvent);
    writeEventsToFile(events);

    res.status(201).json(newEvent);
};
