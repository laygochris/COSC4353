const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFilePath = path.join(__dirname, "../data/users.json");
const eventsFilePath = path.join(__dirname, "../data/events.json");

// read JSON files
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
};

// write JSON files
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
    }
};

// get all volunteers
const getVolunteers = (req, res) => {
    console.log("Received GET request to /api/volunteers");

    const users = readJsonFile(usersFilePath);
    console.log("Users data loaded:", users);

    const volunteers = users.filter(user => user.userType === "volunteer");
    console.log("Filtered volunteers:", volunteers);

    res.json(volunteers);
};

// match volunteers to events based on required skills
const matchVolunteersToEvent = (req, res) => {
    const volunteerId = parseInt(req.params.volunteerId, 10);
    const users = readJsonFile(usersFilePath);
    const events = readJsonFile(eventsFilePath);

    const volunteer = users.find(user => user.id === volunteerId && user.userType === "volunteer");
    if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
    }

    const matchedEvents = events.map(event => {
        const matchedSkills = event.required_skills.filter(skill => volunteer.skills.includes(skill));
        const matchPercentage = (matchedSkills.length / event.required_skills.length) * 100;
        return {
            ...event,
            matchedSkills, // Include matched skills in response
            matchPercentage
        };
    }).filter(event => event.matchPercentage >= 50) // 50%+ match
      .sort((a, b) => b.matchPercentage - a.matchPercentage); // sort by best match

    res.json({ volunteer, matchedEvents });
};

const getVolunteerById = (req, res) => {
    const users = readJsonFile(usersFilePath);
    const { id } = req.params; // Get ID from URL params

    if (!id) {
        return res.status(400).json({ message: "Volunteer ID is required" });
    }

    const volunteer = users.find(user => user.id.toString() === id && user.userType === "volunteer");

    if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
    }

    res.json({ volunteerId: volunteer.id });
};

module.exports = {
    getVolunteers,
    matchVolunteersToEvent,
    getVolunteerById, 
};