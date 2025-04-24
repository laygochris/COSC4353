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

// Get volunteer by email
exports.getVolunteerByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const volunteer = await User.findOne({ email, userType: "volunteer" }).select("_id email fullName skills");
        if (!volunteer) return res.status(404).json({ message: "Volunteer not found" });

        res.json({ volunteerId: volunteer._id });
    } catch (error) {
        console.error("❌ Error fetching volunteer:", error);
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

// Match a volunteer to a specific event
exports.matchVolunteerToEvent = async (req, res) => {
    const { eventId } = req.params;
    const { volunteerId } = req.body;
  
    console.log("🚀 Match request received:", { eventId, volunteerId }); // ✅ add this
  
    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(volunteerId)) {
      return res.status(400).json({ message: "Invalid eventId or volunteerId format" });
    }
  
    try {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });
  
      if (!event.assignedVolunteers.includes(volunteerId)) {
        event.assignedVolunteers.push(volunteerId);
        await event.save();
      }
  
      res.status(200).json({ message: "Volunteer matched to event successfully" });
    } catch (error) {
      console.error("❌ Error matching volunteer to event:", error);
      res.status(500).json({ message: "Server error during volunteer matching" });
    }
  };
  
