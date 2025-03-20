const VolunteerHistory = require("../models/volunteerhistory");
const jwt = require("jsonwebtoken");

// ✅ Get volunteer history by user ID
const getVolunteerHistory = async (req, res) => {
    try {
        console.log("Fetching volunteer history...");

        // ✅ Fix: Extract user ID from `req.user`
        const userID = req.user?.id;  // Now `req.user` is guaranteed to exist

        if (!userID) {
            console.error("Unauthorized: User ID missing");
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        console.log(`Fetching history for user ID: ${userID}`);

        // ✅ Fetch volunteer history for the user and populate event details
        const history = await VolunteerHistory.find({ volunteer: userID }).populate({
            path: "event",
            select: "name description location required_skills urgency status date",
        });

        if (!history.length) {
            console.log("No history found for user.");
            return res.status(200).json([]);
        }

        console.log(`Fetched history: ${JSON.stringify(history, null, 2)}`);

        // ✅ Format response for frontend
        const formattedHistory = history.map(entry => ({
            id: entry.event?._id || "N/A",
            name: entry.event?.name || "N/A",
            description: entry.event?.description || "N/A",
            location: entry.event?.location || "N/A",
            required_skills: entry.event?.required_skills || [],
            urgency: entry.event?.urgency || "low",
            status: entry.event?.status || "upcoming",
            date: entry.event?.date ? new Date(entry.event.date).toISOString() : null,
        }));

        res.json(formattedHistory);
    } catch (error) {
        console.error("Error fetching volunteer history:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = {
    getVolunteerHistory,
};
