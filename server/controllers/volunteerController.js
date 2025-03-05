const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFilePath = path.join(__dirname, "../data/users.json");
const eventsFilePath = path.join(__dirname, "../data/events.json");

// Read JSON files
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, "utf8");
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
};

// Write JSON files
const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), "utf8");
    } catch (error) {
        console.error(`Error writing to file ${filePath}:`, error);
    }
};

// Get all volunteers
const getVolunteers = (req, res) => {
    console.log("Received GET request to /api/volunteers");

    const users = readJsonFile(usersFilePath);
    console.log("Users data loaded:", users);

    const volunteers = users.filter(user => user.userType === "volunteer");
    console.log("Filtered volunteers:", volunteers);

    res.json(volunteers);
};

// Match volunteers to events based on required skills
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
    }).filter(event => event.matchPercentage >= 50) // Only return events with 50%+ match
      .sort((a, b) => b.matchPercentage - a.matchPercentage); // Sort by best match

    res.json({ volunteer, matchedEvents });
};

// Create new volunteer
const createVolunteer = (req, res) => {
    const users = readJsonFile(usersFilePath);
    const { firstName, lastName, email, skills } = req.body;

    if (!firstName || !lastName || !email || !skills) {
        return res.status(400).json({ message: "Missing required fields" });
    }

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
        skills: Array.isArray(skills) ? skills : [skills] 
    };

    users.push(newVolunteer);
    writeJsonFile(usersFilePath, users);

    res.status(201).json(newVolunteer);
};

module.exports = {
    getVolunteers,
    matchVolunteersToEvent,
    createVolunteer
};