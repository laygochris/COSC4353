const fs = require("fs");
const path = require("path");

// File paths
const usersFilePath = path.join(__dirname, "../data/users.json");
const eventsFilePath = path.join(__dirname, "../data/events.json");

// Helper function to read JSON files
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data ? JSON.parse(data) : []; // Handle empty file scenario
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
};

// Helper function to write JSON files
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
    }
};

// Get all volunteers
exports.getVolunteers = (req, res) => {
    const users = readJsonFile(usersFilePath);
    const volunteers = users.filter(user => user.userType === "volunteer");
    res.json(volunteers);
};

// Match volunteers to an event based on required skills
exports.matchVolunteersToEvent = (req, res) => {
    const eventId = parseInt(req.params.eventId);
    const users = readJsonFile(usersFilePath);
    const events = readJsonFile(eventsFilePath);

    const event = events.find(e => e.id === eventId);
    if (!event) {
        return res.status(404).json({ message: "Event not found" });
    }

    const volunteers = users.filter(user => user.userType === "volunteer");
    
    // Matching volunteers based on required skills
    const matchedVolunteers = volunteers.filter(volunteer =>
        event.required_skills.every(skill => volunteer.skills?.includes(skill))
    );

    res.json({ event, matchedVolunteers });
};

// ✅ Assign a volunteer to an event
exports.assignVolunteerToEvent = (req, res) => {
    const { volunteerId, eventId } = req.body;

    if (!volunteerId || !eventId) {
        return res.status(400).json({ message: "Missing volunteerId or eventId" });
    }

    const users = readJsonFile(usersFilePath);
    const events = readJsonFile(eventsFilePath);

    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) {
        return res.status(404).json({ message: "Event not found" });
    }

    const volunteer = users.find(user => user.id === volunteerId && user.userType === "volunteer");
    if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
    }

    // Initialize assignedVolunteers array if undefined
    if (!events[eventIndex].assignedVolunteers) {
        events[eventIndex].assignedVolunteers = [];
    }

    // Prevent duplicate assignments
    if (events[eventIndex].assignedVolunteers.includes(volunteerId)) {
        return res.status(400).json({ message: `Volunteer ${volunteerId} is already assigned to this event` });
    }

    // Assign volunteer
    events[eventIndex].assignedVolunteers.push(volunteerId);
    writeJsonFile(eventsFilePath, events);

    res.json({ message: `Volunteer ${volunteerId} assigned to event ${eventId}` });
};

// ✅ Create a new volunteer with a unique ID
exports.createVolunteer = (req, res) => {
    const users = readJsonFile(usersFilePath);
    const { firstName, lastName, email, skills } = req.body;

    if (!firstName || !lastName || !email || !skills) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    // Prevent duplicate volunteers
    const existingVolunteer = users.find(user => user.email === email);
    if (existingVolunteer) {
        return res.status(400).json({ message: "Volunteer with this email already exists" });
    }

    const newVolunteer = {
        id: users.length > 0 ? Math.max(...users.map(user => user.id)) + 1 : 1,
        firstName,
        lastName,
        email,
        userType: "volunteer",
        skills: Array.isArray(skills) ? skills : [skills] // Ensure skills is an array
    };

    users.push(newVolunteer);
    writeJsonFile(usersFilePath, users);

    res.status(201).json(newVolunteer);
};
