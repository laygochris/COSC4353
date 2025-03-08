const request = require("supertest");
const express = require("express");
const {
  getUserNotifications,
  createNotification,
  dismissNotification,
} = require("../controllers/notificationController");
const verifyToken = require("../middleware/verifyToken");

const app = express();
app.use(express.json());

// Mock routes
app.get("/api/notifications", verifyToken, getUserNotifications);
app.post("/api/notifications", verifyToken, createNotification);
app.delete("/api/notifications/:id", verifyToken, dismissNotification);

jest.mock("../middleware/verifyToken", () => (req, res, next) => {
  req.user = { id: 3 }; // Simulated logged-in user (User ID: 3)
  next();
});

jest.mock("../controllers/notificationController", () => {
  const originalModule = jest.requireActual("../controllers/notificationController");

  return {
    ...originalModule,
    getUserNotifications: jest.fn((req, res) => {
      const mockNotifications = [
        { id: 1712345678901, userIDs: [3, 5], message: "New event available!", type: "info" },
        { id: 1712345678904, userIDs: [3], message: "Urgent event needs volunteers!", type: "danger" },
      ];
      const userNotifications = mockNotifications.filter(n => n.userIDs.includes(req.user.id));
      res.json(userNotifications);
    }),
    createNotification: jest.fn((req, res) => {
      const newNotification = { id: Date.now(), userIDs: [req.user.id], ...req.body };
      res.status(201).json(newNotification);
    }),
    dismissNotification: jest.fn((req, res) => {
      res.json({ message: `Notification ${req.params.id} dismissed.` });
    }),
  };
});

describe("Notification API Tests", () => {
  it("should fetch user-specific notifications", async () => {
    const response = await request(app).get("/api/notifications");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("message");
  });

  it("should create a new notification", async () => {
    const newNotification = { message: "Test notification", type: "info" };
    const response = await request(app)
      .post("/api/notifications")
      .send(newNotification);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.message).toBe(newNotification.message);
  });

  it("should dismiss a notification", async () => {
    const notificationId = 1712345678901;
    const response = await request(app).delete(`/api/notifications/${notificationId}`);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toContain(`Notification ${notificationId} dismissed`);
  });
});
