const axios = require("axios");

let volunteers = [
    {
        id: 1,
        name: "Alice Johnson",
        skills: ["Teamwork", "Leadership"],
        matchedEvents: []
    },
    {
        id: 2,
        name: "Bob Smith",
        skills: ["Communication", "Organization"],
        matchedEvents: []
    }
];

// get all volunteers
exports.getVolunteers = (req, res) => {
    res.json(volunteers);
};

// get a single volunteer by ID 
exports.getVolunteerById = async (req, res) => {
    const volunteerId = parseInt(req.params.id);
    const volunteer = volunteers.find(v => v.id === volunteerId);

    if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
    }

    try {
        // fetch all events
        const response = await axios.get("http://localhost:5001/api/events");
        const events = response.data;

        // match events based on volunteer's skills
        volunteer.matchedEvents = events.filter(event =>
            event.skills.some(skill => volunteer.skills.includes(skill))
        );

        res.json(volunteer);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Error retrieving event details." });
    }
};
