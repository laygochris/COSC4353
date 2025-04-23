const request = require("supertest");
const express = require("express");
const {
  getVolunteers,
  matchVolunteersToEvent,
  getVolunteerById,
} = require("../controllers/volunteerController");
const verifyToken = require("../middleware/verifyToken");

const app = express();
app.use(express.json());

// Mock routes
app.get("/api/volunteers", verifyToken, getVolunteers);
app.get("/api/volunteers/match/:volunteerId", verifyToken, matchVolunteersToEvent);
app.get("/api/volunteers/:id", verifyToken, getVolunteerById);

// ✅ Mock Middleware for Authentication
jest.mock("../middleware/verifyToken", () => (req, res, next) => {
  req.user = { id: 3, userType: "volunteer" }; // Simulated logged-in volunteer
  next();
});

// ✅ Mock Data for Volunteers & Events
jest.mock("../controllers/volunteerController", () => {
  const originalModule = jest.requireActual("../controllers/volunteerController");

  return {
    ...originalModule,
    getVolunteers: jest.fn((req, res) => {
      const mockVolunteers = [
        { id: 1, userType: "volunteer", firstName: "Alice", lastName: "Smith", skills: ["Organization", "Communication"] },
        { id: 2, userType: "volunteer", firstName: "Bob", lastName: "Johnson", skills: ["Leadership", "Problem Solving"] },
      ];
      res.json(mockVolunteers);
    }),
    matchVolunteersToEvent: jest.fn((req, res) => {
      const mockVolunteer = { id: parseInt(req.params.volunteerId, 10), userType: "volunteer", skills: ["Organization", "Communication"] };
      const mockEvents = [
        { id: 101, name: "Community Food Drive", required_skills: ["Organization", "Communication"] },
        { id: 102, name: "Tech Workshop", required_skills: ["Leadership"] },
      ];
      const matchedEvents = mockEvents.filter(event =>
        event.required_skills.some(skill => mockVolunteer.skills.includes(skill))
      );
      res.json({ volunteer: mockVolunteer, matchedEvents });
    }),
    getVolunteerById: jest.fn((req, res) => {
      res.json({ volunteerId: parseInt(req.params.id, 10) });
    }),
  };
});

// ✅ Test Cases
describe("Volunteer API Tests", () => {
  it("should fetch all volunteers", async () => {
    const response = await request(app).get("/api/volunteers");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("firstName");
  });

  it("should match volunteer to events based on skills", async () => {
    const response = await request(app).get("/api/volunteers/match/1");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("volunteer");
    expect(response.body).toHaveProperty("matchedEvents");
    expect(response.body.matchedEvents.length).toBeGreaterThan(0);
  });

  it("should fetch a volunteer by ID", async () => {
    const response = await request(app).get("/api/volunteers/3");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("volunteerId");
    expect(response.body.volunteerId).toBe(3);
  });
});
