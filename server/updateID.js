const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/users"); // Your User model (credentials)
const Volunteer = require("./models/volunteers"); // Your volunteer profile model

const updateVolunteerReferences = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB Atlas");

    const volunteers = await Volunteer.find({});
    for (let volunteer of volunteers) {
      // Find the corresponding user using a unique field like email
      const user = await User.findOne({ email: volunteer.email });
      if (user) {
        volunteer.user = user._id; // Update the reference
        await volunteer.save();
        console.log(`Updated volunteer ${volunteer.fullName} with user ID ${user._id}`);
      } else {
        console.log(`No matching user found for volunteer with email ${volunteer.email}`);
      }
    }
    console.log("Migration complete");
    process.exit(0);
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
};

updateVolunteerReferences();
