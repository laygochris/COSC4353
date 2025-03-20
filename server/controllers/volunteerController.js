const Volunteer = require("../models/volunteers");

// Fetch all volunteers
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find({});
        res.json(volunteers);
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Fetch volunteer by ID
const getVolunteerById = async (req, res) => {
    try {
        const { id } = req.params;
        const volunteer = await Volunteer.findById(id);
        if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });
        res.json(volunteer);
    } catch (error) {
        console.error("Error fetching volunteer:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getVolunteers,
    getVolunteerById,
};
