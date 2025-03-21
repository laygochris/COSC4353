require("dotenv").config();
const httpMocks = require("node-mocks-http");
const { getAllEvents, getVolunteerHistory, assignVolunteerToEvent } = require("../controllers/historyController");
const Event = require("../models/events");
const mongoose = require("mongoose");

jest.setTimeout(10000);
jest.mock("../models/events");

describe("History Controller", () => {
  describe("getAllEvents", () => {
    it("should return all events", async () => {
      const req = httpMocks.createRequest({ method: "GET", url: "/api/history/all" });
      const res = httpMocks.createResponse();

      const mockEvents = [
        { id: 1, name: "Food Drive", assignedVolunteers: [3, 5] },
        { id: 2, name: "Beach Cleanup", assignedVolunteers: [2, 4] },
      ];

      Event.find.mockResolvedValue(mockEvents);

      await getAllEvents(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockEvents);
    });

    it("should return 500 on error", async () => {
      const req = httpMocks.createRequest({ method: "GET", url: "/api/history/all" });
      const res = httpMocks.createResponse();

      Event.find.mockImplementation(() => Promise.reject(new Error("Test error")));

      await getAllEvents(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("getVolunteerHistory", () => {
    it("should return 400 for invalid ObjectId format", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/history/invalid-id",
        params: { userId: "invalid-id" },
      });
      const res = httpMocks.createResponse();

      await getVolunteerHistory(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Invalid ObjectId format" });
    });

    it("should return history of events for valid volunteer", async () => {
      const volunteerId = "67dd1e8bd8ce3bfc437192f9";
      const req = httpMocks.createRequest({
        method: "GET",
        url: `/api/history/profile/${volunteerId}`,
        params: { userId: volunteerId },
      });
      const res = httpMocks.createResponse();

      const mockEvents = [
        { name: "Food Drive", assignedVolunteers: [volunteerId] },
        { name: "Tree Planting", assignedVolunteers: ["other-id"] },
      ];

      Event.find.mockResolvedValue(mockEvents.filter(e => e.assignedVolunteers.includes(volunteerId)));

      await getVolunteerHistory(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual([
        { name: "Food Drive", assignedVolunteers: [volunteerId] },
      ]);
    });

    it("should return 404 if no history is found", async () => {
      const volunteerId = "67dd1e8bd8ce3bfc437192fa";
      const req = httpMocks.createRequest({
        method: "GET",
        url: `/api/history/profile/${volunteerId}`,
        params: { userId: volunteerId },
      });
      const res = httpMocks.createResponse();

      Event.find.mockResolvedValue([]);

      await getVolunteerHistory(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "No volunteer history found for this user" });
    });

    it("should return 500 on error", async () => {
      const volunteerId = "67dd1e8bd8ce3bfc437192fb";
      const req = httpMocks.createRequest({
        method: "GET",
        url: `/api/history/profile/${volunteerId}`,
        params: { userId: volunteerId },
      });
      const res = httpMocks.createResponse();

      Event.find.mockImplementation(() => Promise.reject(new Error("Test error")));

      await getVolunteerHistory(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("assignVolunteerToEvent", () => {
    it("should assign a volunteer to an event", async () => {
      const volunteerId = "67dd1e8bd8ce3bfc437192fc";
      const eventId = "67dd1e8bd8ce3bfc437192fd";

      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/history/assign",
        body: { volunteerId, eventId },
      });
      const res = httpMocks.createResponse();

      const mockEvent = {
        _id: eventId,
        assignedVolunteers: [],
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(Event, "findById").mockResolvedValue(mockEvent);

      await assignVolunteerToEvent(req, res);
      expect(mockEvent.assignedVolunteers).toContain(volunteerId);
      expect(mockEvent.save).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({
        message: `Volunteer ${volunteerId} assigned to event ${eventId}`,
        event: expect.objectContaining({
          _id: eventId,
          assignedVolunteers: expect.arrayContaining([volunteerId]),
        }),
      });
    });

    it("should return 400 for invalid IDs", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/history/assign",
        body: { volunteerId: "badId", eventId: "alsoBad" },
      });
      const res = httpMocks.createResponse();

      await assignVolunteerToEvent(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Invalid volunteer ID or event ID" });
    });

    it("should return 404 if event is not found", async () => {
      const volunteerId = "67dd1e8bd8ce3bfc437192fc";
      const eventId = "67dd1e8bd8ce3bfc437192fd";
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/history/assign",
        body: { volunteerId, eventId },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(Event, "findById").mockResolvedValue(null);

      await assignVolunteerToEvent(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Event not found" });
    });

    it("should return 500 if error occurs in assignVolunteerToEvent", async () => {
      const volunteerId = "67dd1e8bd8ce3bfc437192fc";
      const eventId = "67dd1e8bd8ce3bfc437192fd";
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/history/assign",
        body: { volunteerId, eventId },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(Event, "findById").mockImplementation(() => Promise.reject(new Error("Assign error")));

      await assignVolunteerToEvent(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });
});
