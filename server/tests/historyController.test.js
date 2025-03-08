const request = require("supertest");
const express = require("express");
const {
  getAllEvents,
  getVolunteerHistory,
  assignVolunteerToEvent,
  removeVolunteerFromEvent
} = require("../controllers/historyController");
const verifyToken = require("../middleware/verifyToken");

const app = express();
app.use(express.json());

// Mock routes
app.get("/api/volunteer-history", verifyToken, getVolunteerHistory);
app.get("/api/volunteer-history/all", verifyToken, getAllEvents);
app.post("/api/volunteer-history/assign", verifyToken, assignVolunteerToEvent);
app.post("/api/volunteer-history/remove", verifyToken, removeVolunteerFromEvent);

jest.mock("../middleware/verifyToken", () => (req, res, next) => {
  req.user = { id: 3 }; // Simulated logged-in volunteer (User ID: 3)
  next();
});

jest.mock("../controllers/historyController", () => {
  const originalModule = jest.requireActual("../controllers/historyController");

  return {
    ...originalModule,
    getAllEvents: jest.fn((req, res) => {
      const mockHistory = [
        { id: 1, name: "Food Drive", assignedVolunteers: [3, 5] },
        { id: 2, name: "Beach Cleanup", assignedVolunteers: [2, 4] },
      ];
      res.json(mockHistory);
    }),
    getVolunteerHistory: jest.fn((req, res) => {
      const mockHistory = [
        { id: 1, name: "Food Drive", assignedVolunteers: [3, 5] },
        { id: 2, name: "Beach Cleanup", assignedVolunteers: [2, 4] },
      ];
      const userHistory = mockHistory.filter(event =>
        Array.isArray(event.assignedVolunteers) && event.assignedVolunteers.includes(req.user.id)
      );
      res.json(userHistory);
    }),
    assignVolunteerToEvent: jest.fn((req, res) => {
      res.json({ message: `Volunteer ${req.body.volunteerId} assigned to event ${req.body.eventId}` });
    }),
    removeVolunteerFromEvent: jest.fn((req, res) => {
      res.json({ message: `Volunteer ${req.body.volunteerId} removed from event ${req.body.eventId}` });
    }),
  };
});

describe("Volunteer History API Tests", () => {
  it("should fetch all events", async () => {
    const response = await request(app).get("/api/volunteer-history/all");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("name");
  });

  it("should fetch volunteer history for a specific user", async () => {
    const response = await request(app).get("/api/volunteer-history");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should assign a volunteer to an event", async () => {
    const response = await request(app)
      .post("/api/volunteer-history/assign")
      .send({ volunteerId: 3, eventId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("Volunteer 3 assigned to event 1");
  });

  it("should remove a volunteer from an event", async () => {
    const response = await request(app)
      .post("/api/volunteer-history/remove")
      .send({ volunteerId: 3, eventId: 1 });

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("Volunteer 3 removed from event 1");
  });
});
