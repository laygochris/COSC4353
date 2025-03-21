const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/users.js");  

const usersData = [
  {
    username: "link",
    email: "link@hyrule.com",
    password: "zelda4ever",
    userType: "admin",
    fullName: "Link Hero",
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
    email: "alice@example.com",
    password: "password",
    userType: "volunteer",
    fullName: "Alice Johnson",
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
    email: "bob@example.com",
    password: "password",
    userType: "volunteer",
    fullName: "Bob Smith",
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
    email: "chris@example.com",
    password: "password",
    userType: "volunteer",
    fullName: "Chris Laygo",
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
    email: "adam@example.com",
    password: "password",
    userType: "volunteer",
    fullName: "Adam Martinez",
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
    email: "dylan@example.com",
    password: "password",
    userType: "volunteer",
    fullName: "Dylan Leanord",
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
    email: "annette@example.com",
    password: "password",
    userType: "volunteer",
    fullName: "Annette Tran",
    address: "321 Birch St",
    city: "Houston",
    state: "TX",
    zipcode: "77002",
    skills: ["Software Development", "Data Analysis"],
    preferences: ["Tech Education", "Coding Bootcamps"],
    availability: "Weekdays"
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");

    for (let user of usersData) {
      const existingUser = await User.findOne({ username: user.username });
      if (!existingUser) {
        // Create user including volunteer attributes
        await User.create(user);
        console.log(`✅ Inserted user: ${user.username}`);
      } else {
        console.log(`⚠️ User "${user.username}" already exists, updating info...`);
        await User.updateOne(
          { username: user.username },
          { $set: user }  // Update user with volunteer attributes
        );
      }
    }

    console.log("✅ Database seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
