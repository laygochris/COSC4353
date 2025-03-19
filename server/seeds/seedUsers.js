const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/users.js");

// Your sample data
const usersData = [
  {
    "id": 2,
    "firstName": "Link",
    "lastName": "Link",
    "email": "link@hyrule.com",
    "username": "link",
    "password": "zelda4ever",
    "userType": "admin",
    "skills": ["Leadership", "Teamwork"]
  },
  {
    "id": 3,
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice@example.com",
    "username": "alice",
    "password": "password",
    "userType": "volunteer",
    "skills": ["Communication", "Organization"]
  },
  {
    "id": 4,
    "firstName": "Bob",
    "lastName": "Brown",
    "email": "bob@example.com",
    "username": "bob",
    "password": "password",
    "userType": "volunteer",
    "skills": ["Teamwork", "Animal Care"]
  },
  
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    // Insert data. You can use insertMany to seed an array of documents.
    await User.insertMany(usersData);
    console.log("User data seeded successfully!");

    // Exit the process
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedUsers();
