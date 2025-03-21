require("dotenv").config(); // Ensure environment variables are loaded first
const mongoose = require("mongoose");
const Event = require("../models/events.js");
const User = require("../models/users.js"); // Import users to fetch ObjectId

const seedEvents = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is undefined. Check your .env file.");
        }

        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB Atlas");

        // Fetch users dynamically by their usernames
        const aliceUser = await User.findOne({ username: "alice" }).lean();
        const bobUser = await User.findOne({ username: "bob" }).lean();

        const eventsData = [
            {
                name: "Community Food Drive",
                date: new Date("2025-04-05"),
                location: "Downtown Houston, TX",
                requiredSkills: ["Teamwork", "Organization", "Communication"], 
                urgency: "high",
                status: "upcoming",
                description: "Help distribute food to families in need. Volunteers will assist with sorting, packing, and distributing food items.",
                assignedVolunteers: [aliceUser?._id, bobUser?._id].filter(Boolean) // ✅ Only push valid ObjectIds
            },
            {
                name: "Park Cleanup Initiative",
                date: new Date("2025-03-20"),
                location: "Buffalo Bayou Park, Houston",
                requiredSkills: ["Teamwork", "Leadership", "Organization"], 
                urgency: "medium",
                status: "completed",
                description: "Join us in cleaning up the park! Volunteers will remove litter, plant trees, and maintain green spaces.",
                assignedVolunteers: [aliceUser?._id].filter(Boolean)
            },
            {
                name: "Leadership Workshop",
                date: new Date("2025-05-10"),
                location: "University of Houston",
                requiredSkills: ["Leadership", "Communication", "Organization"],
                urgency: "low",
                status: "upcoming",
                description: "A workshop designed to develop leadership and communication skills for young professionals.",
                assignedVolunteers: []
            },
            {
                name: "Disaster Relief Effort",
                date: new Date("2025-06-01"),
                location: "Houston, TX",
                requiredSkills: ["Teamwork", "Leadership", "Communication"],
                urgency: "very high",
                status: "canceled",
                description: "Assist in providing immediate relief to disaster-affected areas. Volunteers will help distribute supplies and assist with coordination efforts.",
                assignedVolunteers: [aliceUser?._id].filter(Boolean)
            },
            {
                name: "Animal Shelter Volunteer Day",
                date: new Date("2025-04-25"),
                location: "Houston Animal Shelter",
                requiredSkills: ["Animal Care", "Teamwork", "Organization"],
                urgency: "medium",
                status: "upcoming",
                description: "Help take care of rescued animals by cleaning enclosures, feeding, and assisting with pet adoptions.",
                assignedVolunteers: []
            }
        ];

        // Use insertMany with upsert to prevent duplicates
        for (let event of eventsData) {
            await Event.updateOne(
                { name: event.name }, // Match by event name
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
