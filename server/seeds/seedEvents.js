const mongoose = require("mongoose");
require("dotenv").config();
const Event = require("../models/events.js");
const User = require("../models/users.js"); // Import users to fetch ObjectId

const seedEvents = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is undefined. Check your .env file.");
        }

        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB Atlas");

        // Fetch all users and map their usernames to ObjectIds
        const users = await User.find({}, "_id username");
        const userMap = {};
        users.forEach(user => {
            userMap[user.username] = user._id;
        });

        const eventsData = [
            {
                name: "Community Food Drive",
                date: new Date("2025-04-05"),
                location: "Downtown Houston, TX",
                requiredSkills: ["Teamwork", "Organization", "Communication"], // ✅ Include required skills
                urgency: "high",
                status: "upcoming",
                description: "Help distribute food to families in need. Volunteers will assist with sorting, packing, and distributing food items.",
                assignedVolunteers: [userMap["alice"], userMap["bob"]].filter(Boolean)
            },
            {
                name: "Park Cleanup Initiative",
                date: new Date("2025-03-20"),
                location: "Buffalo Bayou Park, Houston",
                requiredSkills: ["Teamwork", "Leadership", "Organization"], // ✅ Include required skills
                urgency: "medium",
                status: "completed",
                description: "Join us in cleaning up the park! Volunteers will remove litter, plant trees, and maintain green spaces.",
                assignedVolunteers: [userMap["alice"]].filter(Boolean)
            },
            {
                name: "Leadership Workshop",
                date: new Date("2025-05-10"),
                location: "University of Houston",
                requiredSkills: ["Leadership", "Communication", "Organization"], // ✅ Include required skills
                urgency: "low",
                status: "upcoming",
                description: "A workshop designed to develop leadership and communication skills for young professionals.",
                assignedVolunteers: []
            },
            {
                name: "Disaster Relief Effort",
                date: new Date("2025-06-01"),
                location: "Houston, TX",
                requiredSkills: ["Teamwork", "Leadership", "Communication"], // ✅ Include required skills
                urgency: "very high",
                status: "canceled",
                description: "Assist in providing immediate relief to disaster-affected areas. Volunteers will help distribute supplies and assist with coordination efforts.",
                assignedVolunteers: [userMap["alice"]].filter(Boolean)
            },
            {
                name: "Animal Shelter Volunteer Day",
                date: new Date("2025-04-25"),
                location: "Houston Animal Shelter",
                requiredSkills: ["Animal Care", "Teamwork", "Organization"], // ✅ Include required skills
                urgency: "medium",
                status: "upcoming",
                description: "Help take care of rescued animals by cleaning enclosures, feeding, and assisting with pet adoptions.",
                assignedVolunteers: []
            }
        ];

        for (let event of eventsData) {
            await Event.updateOne(
                { name: event.name },  // Match by event name
                event,
                { upsert: true } // ✅ Insert if missing, update if exists
            );
        }

        console.log("✅ Events seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding events:", error);
        process.exit(1);
    }
};

seedEvents();
