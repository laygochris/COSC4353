let events = [
    {
        id: 1,
        name: "Community Cleanup",
        location: "Galveston, TX",
        date: "08/16/24",
        description: "Join us in cleaning up the coastline to protect marine life.",
        skills: ["Teamwork", "Leadership"]
    },
    {
        id: 2,
        name: "Food Bank Assistance",
        location: "Houston Food Bank",
        date: "07/20/24",
        description: "Help distribute food to families in need.",
        skills: ["Organization", "Customer Service"]
    }
];

// Get all events
exports.getEvents = (req, res) => {
    res.json(events);
};

// Get a single event by ID
exports.getEventById = (req, res) => {
    const eventId = parseInt(req.params.id);
    const event = events.find(e => e.id === eventId);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
};

// Create a new event
exports.createEvent = (req, res) => {
    const { name, location, date, description, skills } = req.body;
    if (!name || !location || !date || !description || !skills) {
        return res.status(400).json({ message: "Missing required event fields" });
    }

    const newEvent = {
        id: events.length + 1,
        name,
        location,
        date,
        description,
        skills
    };
    events.push(newEvent);
    res.status(201).json(newEvent);
};
