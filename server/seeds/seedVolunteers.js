const mongoose = require("mongoose");
require("dotenv").config();
const Volunteer = require("../models/volunteers");
const User = require("../models/users");

const volunteersData = [
    {
        username: "link",
        fullName: "Link Hero",
        email: "link@hyrule.com",
        address: "Castle Town, Hyrule",
        city: "Hyrule",
        state: "HY",
        zipcode: "00001",
        skills: ["Sword Fighting", "Problem Solving"],
        preferences: ["Monster Hunting", "Treasure Hunting"],
        availability: "Weekends"
    },
    {
        username: "alice",
        fullName: "Alice Johnson",
        email: "alice@example.com",
        address: "123 Main St",
        city: "Houston",
        state: "TX",
        zipcode: "77001",
        skills: ["Teamwork", "Organization"],
        preferences: ["Food Drive", "Community Outreach"],
        availability: "Weekends"
    },
    {
        username: "bob",
        fullName: "Bob Smith",
        email: "bob@example.com",
        address: "456 Elm St",
        city: "Austin",
        state: "TX",
        zipcode: "78701",
        skills: ["Communication", "Leadership"],
        preferences: ["Teaching", "Disaster Relief"],
        availability: "Weekdays"
    },
    {
        username: "chrislaygo",
        fullName: "Chris Laygo",
        email: "chris@example.com",
        address: "789 Pine St",
        city: "Dallas",
        state: "TX",
        zipcode: "75201",
        skills: ["Technical Skills", "Project Management"],
        preferences: ["Tech Volunteering", "STEM Education"],
        availability: "Weekends"
    },
    {
        username: "adammartinez",
        fullName: "Adam Martinez",
        email: "adam@example.com",
        address: "159 Oak St",
        city: "San Antonio",
        state: "TX",
        zipcode: "78205",
        skills: ["Teamwork", "Community Engagement"],
        preferences: ["Food Distribution", "Shelter Assistance"],
        availability: "Flexible"
    },
    {
        username: "dylanleanord",
        fullName: "Dylan Leanord",
        email: "dylan@example.com",
        address: "753 Maple St",
        city: "Austin",
        state: "TX",
        zipcode: "78702",
        skills: ["Public Speaking", "Leadership"],
        preferences: ["Youth Mentorship", "Public Advocacy"],
        availability: "Evenings"
    },
    {
        username: "annetteptran",
        fullName: "Annette Tran",
        email: "annette@example.com",
        address: "321 Birch St",
        city: "Houston",
        state: "TX",
        zipcode: "77002",
        skills: ["Software Development", "Data Analysis"],
        preferences: ["Tech Education", "Coding Bootcamps"],
        availability: "Weekdays"
    }
];

const seedVolunteers = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("❌ MONGO_URI is undefined. Check your .env file.");
        }

        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Connected to MongoDB Atlas");

        for (let volunteer of volunteersData) {
            // ✅ Ensure a matching user exists
            const user = await User.findOne({ username: volunteer.username });

            if (!user) {
                console.log(`❌ No user found for username: ${volunteer.username}, skipping...`);
                continue;
            }

            // ✅ Ensure `email` is included from both volunteersData and User model
            await Volunteer.updateOne(
                { user: user._id },  // Match by user ID
                {
                    user: user._id, 
                    fullName: volunteer.fullName,
                    email: volunteer.email, // ✅ Uses email directly from `volunteersData`
                    address: volunteer.address,
                    city: volunteer.city,
                    state: volunteer.state,
                    zipcode: volunteer.zipcode,
                    skills: volunteer.skills,
                    preferences: volunteer.preferences,
                    availability: volunteer.availability
                },
                { upsert: true }  // ✅ If user exists, update; otherwise, insert new
            );

            console.log(`✅ Volunteer profile added/updated for: ${volunteer.username}`);
        }

        console.log("✅ Volunteer seeding completed!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding volunteers:", error);
        process.exit(1);
    }
};

seedVolunteers();
