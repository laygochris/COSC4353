const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // References User model
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // ✅ Email is now required and unique
    address: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipcode: { type: String, required: false },
    skills: { type: [String], required: false },
    preferences: { type: [String], required: false },
    availability: { type: String, required: false }
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
