const mongoose = require("mongoose");
const User = require("../models/users"); 
const Event = require("../models/events"); 

// Get all volunteers
exports.getVolunteers = async (req, res) => {
    try {
        const volunteers = await User.find({ userType: "volunteer" }).select("-password");
        res.json(volunteers);
    } catch (error) {
        console.error("❌ Error fetching volunteers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get volunteer by ID (ObjectId)
exports.getVolunteerById = async (req, res) => {
    try {
        const { volunteerId } = req.params;  // Get volunteerId from the URL parameters

        // Validate if the volunteerId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(volunteerId)) {
            return res.status(400).json({ message: "Invalid volunteer ID format" });
        }

        // Fetch the volunteer by ObjectId
        const volunteer = await User.findById(volunteerId).select("-password");  // Exclude password for security

        if (!volunteer) {
            return res.status(404).json({ message: "Volunteer not found" });
        }

        // Return the volunteer's information
        res.json(volunteer);
    } catch (error) {
        console.error("❌ Error fetching volunteer by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Match volunteers to events based on required skills
exports.matchVolunteersToEvent = async (req, res) => {
    try {
        const { volunteerId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(volunteerId)) {
            return res.status(400).json({ message: "Invalid ObjectId format for volunteer" });
        }

        const volunteer = await User.findById(volunteerId).select("skills");
        if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

        const events = await Event.find();
        const matchedEvents = events.map(event => {
            const matchedSkills = event.requiredSkills.filter(skill => volunteer.skills.includes(skill));
            const matchPercentage = (matchedSkills.length / event.requiredSkills.length) * 100;

            return { ...event.toObject(), matchedSkills, matchPercentage };
        }).filter(event => event.matchPercentage >= 50)
          .sort((a, b) => b.matchPercentage - a.matchPercentage);

        res.json({ volunteer, matchedEvents });
    } catch (error) {
        console.error("❌ Error matching volunteers to events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
