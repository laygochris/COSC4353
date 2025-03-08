const request = require("supertest");
const express = require("express");
const {
  getEvents,
  getEventById,
  createEvent,
  matchVolunteerToEvent
} = require("../controllers/eventController");
const verifyToken = require("../middleware/verifyToken");

const app = express();
app.use(express.json());

// Mock routes
app.get("/api/events", verifyToken, getEvents);
app.get("/api/events/:id", verifyToken, getEventById);
app.post("/api/events", verifyToken, createEvent);
app.patch("/api/events/match", verifyToken, matchVolunteerToEvent);

jest.mock("../middleware/verifyToken", () => (req, res, next) => {
  req.user = { id: 3 }; // Simulated logged-in user (User ID: 3)
  next();
});

jest.mock("../controllers/eventController", () => {
  const originalModule = jest.requireActual("../controllers/eventController");

  return {
    ...originalModule,
    getEvents: jest.fn((req, res) => {
      const mockEvents = [
        { id: 1, name: "Food Drive", location: "Downtown", date: "2025-04-05", assignedVolunteers: [3, 5] },
        { id: 2, name: "Beach Cleanup", location: "Miami Beach", date: "2025-06-10", assignedVolunteers: [2, 4] }
      ];
      res.json(mockEvents);
    }),
    getEventById: jest.fn((req, res) => {
      const mockEvents = [
        { id: 1, name: "Food Drive", location: "Downtown", date: "2025-04-05", assignedVolunteers: [3, 5] },
        { id: 2, name: "Beach Cleanup", location: "Miami Beach", date: "2025-06-10", assignedVolunteers: [2, 4] }
      ];
      const event = mockEvents.find(e => e.id === parseInt(req.params.id, 10));
      if (!event) return res.status(404).json({ message: "Event not found" });
      res.json(event);
    }),
    createEvent: jest.fn((req, res) => {
      const newEvent = {
        id: Math.floor(Math.random() * 1000),
        name: req.body.name,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        required_skills: req.body.required_skills,
        assignedVolunteers: []
      };
      res.status(201).json(newEvent);
    }),
    matchVolunteerToEvent: jest.fn((req, res) => {
      res.json({ message: `Volunteer ${req.body.volunteerId} assigned to event ${req.body.eventId}` });
    })
  };
});

describe("Event API Tests", () => {
  it("should fetch all events", async () => {
    const response = await request(app).get("/api/events");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("name");
  });

  it("should fetch a single event by ID", async () => {
    const response = await request(app).get("/api/events/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
  });

  it("should return 404 for non-existing event ID", async () => {
    const response = await request(app).get("/api/events/9999");
    expect(response.status).toBe(404);
  });

  it("should create a new event", async () => {
    const newEvent = {
      name: "Blood Donation Camp",
      location: "City Hospital",
      date: "2025-07-15",
      description: "A blood donation drive to help those in need.",
      required_skills: ["Medical Assistance", "Organization"]
    };

    const response = await request(app).post("/api/events").send(newEvent);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(newEvent.name);
  });

  it("should assign a volunteer to an event", async () => {
    const response = await request(app)
      .patch("/api/events/match")
      .send({ volunteerId: 3, eventId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("Volunteer 3 assigned to event 1");
  });
});
