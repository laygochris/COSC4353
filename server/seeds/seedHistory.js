const mongoose = require("mongoose");
require("dotenv").config();
const VolunteerHistory = require("../models/volunteerhistory");
const User = require("../models/users");

const seedVolunteerHistory = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is undefined. Check your .env file.");
        }

        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB Atlas");

        // Fetch all users and create a map of usernames to ObjectIds
        const users = await User.find({}, "_id username");
        const userMap = {};
        users.forEach(user => {
            userMap[user.username] = user._id;
        });

        const historyData = [
            {
                volunteer: userMap["alice"], // ✅ Use ObjectId
                eventName: "Community Food Drive",
                eventDescription: "Help distribute food to families in need.",
                location: "Downtown Houston, TX",
                requiredSkills: ["Teamwork", "Organization", "Communication"],
                urgency: "high",
                date: new Date("2025-04-05"),
                status: "completed"
            },
            {
                volunteer: userMap["bob"], // ✅ Use ObjectId
                eventName: "Park Cleanup Initiative",
                eventDescription: "Join us in cleaning up the park!",
                location: "Buffalo Bayou Park, Houston",
                requiredSkills: ["Teamwork", "Leadership", "Organization"],
                urgency: "medium",
                date: new Date("2025-03-20"),
                status: "completed"
            }
        ];

        for (let history of historyData) {
            if (!history.volunteer) {
                console.log(`⚠️ Skipping history for ${history.eventName}: Volunteer not found.`);
                continue;
            }

            await VolunteerHistory.updateOne(
                { volunteer: history.volunteer, eventName: history.eventName }, // Match by volunteer ID & event name
                history,
                { upsert: true } // ✅ Insert if missing, update if exists
            );

            console.log(`✅ Volunteer history added/updated for: ${history.eventName}`);
        }

        console.log("✅ Volunteer history seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding volunteer history:", error);
        process.exit(1);
    }
};

seedVolunteerHistory();
