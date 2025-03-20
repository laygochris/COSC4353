const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/users.js");
const bcrypt = require("bcrypt");

const usersData = [
  {
    username: "link",
    email: "link@hyrule.com",
    password: "zelda4ever"
  },
  {
    username: "alice",
    email: "alice@example.com",
    password: "password"
  },
  {
    username: "bob",
    email: "bob@example.com",
    password: "password"
  },
  {
    username: "chrislaygo",
    email: "chris@example.com",
    password: "password"
  },
  {
    username: "adammartinez",
    email: "adam@example.com",
    password: "password"
  },
  {
    username: "dylanleanord",
    email: "dylan@example.com",
    password: "password"
  },
  {
    username: "annetteptran",
    email: "annette@example.com",
    password: "password"
  }
];

// ✅ Function to seed users (Only Insert if Not Exists)
const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");

    for (let user of usersData) {
      const existingUser = await User.findOne({ username: user.username });

      if (!existingUser) {
        user.password = await bcrypt.hash(user.password, 10); // Secure password hashing
        await User.create(user); // Insert only if user does not exist
        console.log(`✅ Inserted user: ${user.username}`);
      } else {
        console.log(`⚠️ User "${user.username}" already exists, skipping...`);
      }
    }

    console.log("✅ User seeding completed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seedUsers();
