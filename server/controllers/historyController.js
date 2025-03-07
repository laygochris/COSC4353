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

// ✅ Get all events (for debugging)
exports.getAllEvents = (req, res) => {
  const history = loadVolunteerHistory();
  res.json(history);
};

// ✅ Get volunteer history by ID
exports.getVolunteerHistory = (req, res) => {
  const history = loadVolunteerHistory();
  const volunteerId = parseInt(req.params.volunteerId, 10);

  if (isNaN(volunteerId)) {
    return res.status(400).json({ message: "Invalid volunteer ID" });
  }

  // Filter events where the volunteer is assigned
  const assignedEvents = history.filter(event => event.assignedVolunteers.includes(volunteerId));

  if (assignedEvents.length === 0) {
    return res.status(200).json([]); // Return empty array instead of 404
  }

  res.json(assignedEvents);
};

// ✅ Assign a volunteer to an event
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

// ✅ Remove a volunteer from an event
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
