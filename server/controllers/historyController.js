const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "../data/events.json");

// Load volunteer history (from events.json)
const loadVolunteerHistory = () => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading volunteer history:", error);
    return [];
  }
};

// Save updates to volunteer history
const saveVolunteerHistory = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error saving volunteer history:", error);
  }
};

// Get all events (for debugging)
exports.getAllEvents = (req, res) => {
  const history = loadVolunteerHistory();
  res.json(history);
};

// Get volunteer history by ID
exports.getVolunteerHistory = (req, res) => {
  const userID = req.user.id; 

  if (!userID) {
    return res.status(401).json({ message: "Unauthorized: User ID missing" });
  }

  const history = loadVolunteerHistory();

  console.log(`All Volunteer History:`, history);
  console.log(`User ID from token: ${userID}`);

  const userHistory = history.filter(event => Array.isArray(event.assignedVolunteers) && event.assignedVolunteers.includes(userID));

  console.log(`Filtered Volunteer History for user ${userID}:`, userHistory); 

  res.json(userHistory);
};

// Assign a volunteer to an event
exports.assignVolunteerToEvent = (req, res) => {
  const { volunteerId, eventId } = req.body;
  let history = loadVolunteerHistory();

  const eventIndex = history.findIndex(event => event.id === eventId);
  if (eventIndex === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  if (!history[eventIndex].assignedVolunteers.includes(volunteerId)) {
    history[eventIndex].assignedVolunteers.push(volunteerId);
    saveVolunteerHistory(history);
  }

  res.json({ message: `Volunteer ${volunteerId} assigned to event ${eventId}` });
};

// Remove a volunteer from an event
exports.removeVolunteerFromEvent = (req, res) => {
  const { volunteerId, eventId } = req.body;
  let history = loadVolunteerHistory();

  const eventIndex = history.findIndex(event => event.id === eventId);
  if (eventIndex === -1) {
    return res.status(404).json({ error: "Event not found" });
  }

  history[eventIndex].assignedVolunteers = history[eventIndex].assignedVolunteers.filter(id => id !== volunteerId);
  saveVolunteerHistory(history);

  res.json({ message: `Volunteer ${volunteerId} removed from event ${eventId}` });
};
