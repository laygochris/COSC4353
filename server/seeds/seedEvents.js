const mongoose = require("mongoose");
require("dotenv").config();
const events = require("../models/events.js");

const eventsData = [
    {
      "id": 1,
      "name": "Community Food Drive",
      "date": "2025/04/05",
      "location": "Downtown Houston, TX",
      "required_skills": ["Teamwork", "Organization", "Communication"],
      "urgency": "High",
      "status": "Upcoming",
      "description": "Help distribute food to families in need. Volunteers will assist with sorting, packing, and distributing food items.",
      "assignedVolunteers": [3, 2, 5]
    },
    {
      "id": 2,
      "name": "Park Cleanup Initiative",
      "date": "2025/03/20",
      "location": "Buffalo Bayou Park, Houston",
      "required_skills": ["Teamwork", "Leadership", "Organization"],
      "urgency": "Medium",
      "status": "Completed",
      "description": "Join us in cleaning up the park! Volunteers will remove litter, plant trees, and maintain green spaces.",
      "assignedVolunteers": [3]
    },
    {
      "id": 3,
      "name": "Leadership Workshop",
      "date": "2025/05/10",
      "location": "University of Houston",
      "required_skills": ["Leadership", "Communication", "Organization"],
      "urgency": "Low",
      "status": "Upcoming",
      "description": "A workshop designed to develop leadership and communication skills for young professionals.",
      "assignedVolunteers": []
    },
    {
      "id": 4,
      "name": "Disaster Relief Effort",
      "date": "2025/06/01",
      "location": "Houston, TX",
      "required_skills": ["Teamwork", "Leadership", "Communication"],
      "urgency": "Very High",
      "status": "Canceled",
      "description": "Assist in providing immediate relief to disaster-affected areas. Volunteers will help distribute supplies and assist with coordination efforts.",
      "assignedVolunteers": [3]
    },
    {
      "id": 5,
      "name": "Animal Shelter Volunteer Day",
      "date": "2025/04/25",
      "location": "Houston Animal Shelter",
      "required_skills": ["Animal Care", "Teamwork", "Organization"],
      "urgency": "Medium",
      "status": "Upcoming",
      "description": "Help take care of rescued animals by cleaning enclosures, feeding, and assisting with pet adoptions.",
      "assignedVolunteers": []
    }
  ]
  

  const seedEvents = async () => {
      try {
        // Connect to MongoDB Atlas
        await mongoose.connect(process.env.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB Atlas");
    
        // Insert data
        await events.insertMany(eventsData);
        console.log("Notifications seeded successfully!");
    
        // Exit the process
        process.exit(0);
      } catch (error) {
        console.error("Error seeding notifications:", error);
        process.exit(1);
      }
    };
    
    seedEvents();