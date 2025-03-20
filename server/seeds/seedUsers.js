const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/users.js");

const usersData = [
  {
    username: "link",
    email: "link@hyrule.com",
    password: "zelda4ever",
    userType: "admin"
  },
  {
    username: "alice",
    email: "alice@example.com",
    password: "password",
    userType: "volunteer"
  },
  {
    username: "bob",
    email: "bob@example.com",
    password: "password",
    userType: "volunteer"
  },
  {
    username: "chrislaygo",
    email: "chris@example.com",
    password: "password",
    userType: "volunteer"
  },
  {
    username: "adammartinez",
    email: "adam@example.com",
    password: "password",
    userType: "volunteer"
  },
  {
    username: "dylanleanord",
    email: "dylan@example.com",
    password: "password",
    userType: "volunteer"
  },
  {
    username: "annetteptran",
    email: "annette@example.com",
    password: "password",
    userType: "volunteer"
  }
];

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
        // Create the user without manually hashing the password;
        // the pre-save hook in your User model will hash it automatically.
        await User.create(user);
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
