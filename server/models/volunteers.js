const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
     }, 
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipcode: { type: String, default: '' },
    skills: { type: [String], default: [] },
    preferences: { type: [String], default: [] },
    availability: { type: String, default: '' }
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
