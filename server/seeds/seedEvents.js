require("dotenv").config(); // Ensure environment variables are loaded first
const mongoose = require("mongoose");
const Event = require("../models/events.js");

const seedEvents = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is undefined. Check your .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB Atlas");

    const aliceId = "6809beaca659f180fbf3d891";
    const bobId = "6809beaca659f180fbf3d894";

    const eventsData = [
      {
        name: "Community Food Drive",
        date: new Date("2025-04-05"),
        location: "Downtown Houston, TX",
        requiredSkills: ["Teamwork", "Organization", "Communication"],
        urgency: "high",
        status: "upcoming",
        description:
          "Help distribute food to families in need. Volunteers will assist with sorting, packing, and distributing food items.",
        assignedVolunteers: [aliceId, bobId],
      },
      {
        name: "Park Cleanup Initiative",
        date: new Date("2025-03-20"),
        location: "Buffalo Bayou Park, Houston",
        requiredSkills: ["Teamwork", "Leadership", "Organization"],
        urgency: "medium",
        status: "completed",
        description:
          "Join us in cleaning up the park! Volunteers will remove litter, plant trees, and maintain green spaces.",
        assignedVolunteers: [aliceId],
      },
      {
        name: "Senior Center Game Day",
        date: new Date("2025-03-15"),
        location: "Golden Years Senior Center",
        requiredSkills: ["Communication", "Teamwork"],
        urgency: "low",
        status: "completed",
        description:
          "Spend a day with seniors playing games, chatting, and providing companionship.",
        assignedVolunteers: [bobId],
      },
      {
        name: "Toy Drive Sorting",
        date: new Date("2025-03-10"),
        location: "Downtown Donation Hub",
        requiredSkills: ["Organization"],
        urgency: "medium",
        status: "completed",
        description:
          "Sort and prepare toys for distribution to underprivileged children.",
        assignedVolunteers: [aliceId, bobId],
      },
      {
        name: "Leadership Workshop",
        date: new Date("2025-05-10"),
        location: "University of Houston",
        requiredSkills: ["Leadership", "Communication", "Organization"],
        urgency: "low",
        status: "upcoming",
        description:
          "A workshop designed to develop leadership and communication skills for young professionals.",
        assignedVolunteers: [],
      },
      {
        name: "Disaster Relief Effort",
        date: new Date("2025-06-01"),
        location: "Houston, TX",
        requiredSkills: ["Teamwork", "Leadership", "Communication"],
        urgency: "very high",
        status: "canceled",
        description:
          "Assist in providing immediate relief to disaster-affected areas. Volunteers will help distribute supplies and assist with coordination efforts.",
        assignedVolunteers: [aliceId],
      },
      {
        name: "Animal Shelter Volunteer Day",
        date: new Date("2025-04-25"),
        location: "Houston Animal Shelter",
        requiredSkills: ["Animal Care", "Teamwork", "Organization"],
        urgency: "medium",
        status: "upcoming",
        description:
          "Help take care of rescued animals by cleaning enclosures, feeding, and assisting with pet adoptions.",
        assignedVolunteers: [],
      },
      {
        name: "Team Up for Houston Cleanup",
        description:
          "Join a citywide effort to clean up streets, parks, and playgrounds with fellow volunteers.",
        location: "Houston Heights, TX",
        date: new Date("2025-05-10T08:30:00.000Z"),
        requiredSkills: ["Teamwork"],
        status: "upcoming",
        urgency: "medium",
        assignedVolunteers: [],
      },
      {
        name: "Leadership Workshop for Youth Mentors",
        description:
          "Facilitate a leadership training workshop for teen volunteers mentoring younger students.",
        location: "Emancipation Community Center, Houston, TX",
        date: new Date("2025-06-03T10:00:00.000Z"),
        requiredSkills: ["Leadership"],
        status: "upcoming",
        urgency: "high",
        assignedVolunteers: [],
      },
      {
        name: "Speak Up Saturday: Public Speaking Bootcamp",
        description:
          "Help middle school students build confidence and communication skills through speaking games and mini-presentations.",
        location: "Northside Community Hall, Houston, TX",
        date: new Date("2025-05-18T13:00:00.000Z"),
        requiredSkills: ["Communication"],
        status: "upcoming",
        urgency: "medium",
        assignedVolunteers: [],
      },
      {
        name: "Organize to Optimize: Donation Sorting Drive",
        description:
          "Work with a team to sort, label, and organize incoming donations for local shelters and families.",
        location: "Galleria Donations Warehouse, Houston, TX",
        date: new Date("2025-04-30T09:00:00.000Z"),
        requiredSkills: ["Organization"],
        status: "upcoming",
        urgency: "low",
        assignedVolunteers: [],
      },
      {
        name: "Pet Pal Day at the Shelter",
        description:
          "Assist with animal care tasks such as feeding, walking, cleaning, and cuddling pets awaiting adoption.",
        location: "Pearland Animal Shelter, Pearland, TX",
        date: new Date("2025-05-12T14:00:00.000Z"),
        requiredSkills: ["Animal Care"],
        status: "upcoming",
        urgency: "high",
        assignedVolunteers: [],
      },
    ];

    for (let event of eventsData) {
      await Event.updateOne(
        { name: event.name },
        event,
        { upsert: true }
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
