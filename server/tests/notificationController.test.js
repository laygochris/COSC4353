require('dotenv').config();
const httpMocks = require("node-mocks-http");
const { getUserNotifications, dismissNotification, createNotification } = require("../controllers/notificationController");
const Notification = require("../models/notifications");

// Increase Jest timeout (optional, if needed)
jest.setTimeout(10000);

describe("Notification Controller", () => {
  describe("getUserNotifications", () => {
    it("should return 401 if user ID is missing", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/notifications",
        user: {} // no id provided
      });
      const res = httpMocks.createResponse();

      await getUserNotifications(req, res);
      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ message: "Unauthorized: User ID missing" });
    });

    it("should return notifications for a valid user", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/notifications",
        user: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();

      const mockNotifs = [
        { id: 1712345678901, userIDs: ["507f1f77bcf86cd799439011"], message: "Test notification 1", type: "info" },
        { id: 1712345678904, userIDs: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"], message: "Test notification 2", type: "danger" }
      ];
      // Mock the Notification.find call to return our controlled response
      jest.spyOn(Notification, "find").mockResolvedValue(mockNotifs);

      await getUserNotifications(req, res);
      expect(Notification.find).toHaveBeenCalledWith({ userIDs: "507f1f77bcf86cd799439011" });
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockNotifs);
    });

    it("should return 500 if an error occurs", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/notifications",
        user: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Notification, "find").mockRejectedValue(new Error("Test error"));

      await getUserNotifications(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("dismissNotification", () => {
    it("should return 404 if notification is not found", async () => {
      const req = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/notifications/123",
        params: { id: "123" },
        user: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Notification, "findOne").mockResolvedValue(null);

      await dismissNotification(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Notification not found." });
    });

    it("should update a notification if found", async () => {
      const req = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/notifications/123",
        params: { id: "123" },
        user: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();

      // Create a mock notification that has a save method.
      const mockNotification = {
        id: 123,
        userIDs: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
        save: jest.fn().mockResolvedValue(true)
      };
      jest.spyOn(Notification, "findOne").mockResolvedValue(mockNotification);

      await dismissNotification(req, res);
      // After filtering, the user "507f1f77bcf86cd799439011" should be removed.
      expect(mockNotification.userIDs).toEqual(["507f1f77bcf86cd799439012"]);
      expect(mockNotification.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "Notification 123 updated for user 507f1f77bcf86cd799439011." });
    });

    it("should return 500 if an error occurs in dismissNotification", async () => {
      const req = httpMocks.createRequest({
        method: "DELETE",
        url: "/api/notifications/123",
        params: { id: "123" },
        user: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Notification, "findOne").mockRejectedValue(new Error("Dismiss error"));

      await dismissNotification(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("createNotification", () => {
    it("should return 400 if required fields are missing", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/notifications",
        body: { message: "Test notification", type: "info" } // Missing userIDs
      });
      const res = httpMocks.createResponse();

      await createNotification(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Message, type, and userIDs array are required" });
    });

    it("should create a new notification successfully", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/notifications",
        body: { message: "Test notification", type: "info", userIDs: ["507f1f77bcf86cd799439011"] }
      });
      const res = httpMocks.createResponse();

      const fakeNotification = {
        id: 456,
        message: "Test notification",
        type: "info",
        userIDs: ["507f1f77bcf86cd799439011"]
      };
      jest.spyOn(Notification, "create").mockResolvedValue(fakeNotification);

      await createNotification(req, res);
      expect(Notification.create).toHaveBeenCalledWith({
        id: expect.any(Number),
        message: "Test notification",
        type: "info",
        userIDs: ["507f1f77bcf86cd799439011"]
      });
      expect(res.statusCode).toBe(201);
      expect(res._getJSONData()).toEqual(fakeNotification);
    });

    it("should return 500 if an error occurs in createNotification", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/notifications",
        body: { message: "Test notification", type: "info", userIDs: ["507f1f77bcf86cd799439011"] }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Notification, "create").mockRejectedValue(new Error("Create error"));

      await createNotification(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });
});
