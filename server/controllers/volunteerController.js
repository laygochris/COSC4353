const express = require("express");
const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../data/users.json");
const eventsFilePath = path.join(__dirname, "../data/events.json");

// Read JSON files safely
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw new Error(`Could not read file: ${filePath}`);
    }
};

// Write JSON files safely
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
        return true;
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
        return false;
    }
};

// Get all volunteers
const getVolunteers = (req, res) => {
    console.log("Received GET request to /api/volunteers");
    try {
        const users = readJsonFile(usersFilePath);
        const volunteers = users.filter(user => user.userType === "volunteer");
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: "Error loading volunteers data" });
    }
};

// Match volunteers to events based on skills
const matchVolunteersToEvent = (req, res) => {
    try {
        const volunteerId = parseInt(req.params.volunteerId, 10);
        if (isNaN(volunteerId)) {
            return res.status(400).json({ message: "Invalid Volunteer ID" });
        }

        const users = readJsonFile(usersFilePath);
        const events = readJsonFile(eventsFilePath);

        const volunteer = users.find(user => user.id === volunteerId && user.userType === "volunteer");
        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer not found" });
        }

        const matchedEvents = events
            .map(event => {
                const matchedSkills = event.required_skills.filter(skill => volunteer.skills.includes(skill));
                const matchPercentage = (matchedSkills.length / event.required_skills.length) * 100;
                return { ...event, matchedSkills, matchPercentage };
            })
            .filter(event => event.matchPercentage >= 50)
            .sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json({ volunteer, matchedEvents });
    } catch (error) {
        res.status(500).json({ message: "Error matching volunteer to events" });
    }
};

// Get a single volunteer by ID
const getVolunteerById = (req, res) => {
    try {
        const volunteerId = parseInt(req.params.id, 10);
        if (isNaN(volunteerId)) {
            return res.status(400).json({ message: "Invalid Volunteer ID" });
        }

        const users = readJsonFile(usersFilePath);
        const volunteer = users.find(user => user.id === volunteerId && user.userType === "volunteer");

        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer not found" });
        }

        res.json({ volunteerId: volunteer.id });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving volunteer data" });
    }
};

module.exports = {
    getVolunteers,
    matchVolunteersToEvent,
    getVolunteerById,
};
