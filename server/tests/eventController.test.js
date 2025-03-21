require('dotenv').config();
const httpMocks = require("node-mocks-http");
const { getEvents, getEventById, assignVolunteerToEvent } = require("../controllers/eventController");
const Event = require("../models/events");

jest.setTimeout(10000);

describe("Event Controller", () => {
  describe("getEvents", () => {
    it("should fetch all events successfully", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/events"
      });
      const res = httpMocks.createResponse();

      const mockEvents = [
        { id: 1, name: "Event 1" },
        { id: 2, name: "Event 2" }
      ];
      // Mock the Event.find call to return our controlled response
      jest.spyOn(Event, "find").mockResolvedValue(mockEvents);

      await getEvents(req, res);
      expect(Event.find).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockEvents);
    });

    it("should return 500 if an error occurs in getEvents", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/events"
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Event, "find").mockRejectedValue(new Error("Test error"));

      await getEvents(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("getEventById", () => {
    it("should return 400 for invalid event ID format", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/events/invalid-id",
        params: { id: "invalid-id" }
      });
      const res = httpMocks.createResponse();

      await getEventById(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Invalid ObjectId format for event" });
    });

    it("should return event by ID", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/events/507f1f77bcf86cd799439011",
        params: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();

      const mockEvent = { id: "507f1f77bcf86cd799439011", name: "Sample Event" };
      jest.spyOn(Event, "findById").mockResolvedValue(mockEvent);

      await getEventById(req, res);
      expect(Event.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockEvent);
    });

    it("should return 404 if event not found", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/events/507f1f77bcf86cd799439011",
        params: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Event, "findById").mockResolvedValue(null);

      await getEventById(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Event not found" });
    });

    it("should return 500 if an error occurs in getEventById", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/events/507f1f77bcf86cd799439011",
        params: { id: "507f1f77bcf86cd799439011" }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Event, "findById").mockRejectedValue(new Error("Test error"));

      await getEventById(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("assignVolunteerToEvent", () => {
    it("should return 400 for invalid volunteer or event ID format", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/events/assign",
        body: { volunteerId: "invalid-id", eventId: "invalid-id" }
      });
      const res = httpMocks.createResponse();

      await assignVolunteerToEvent(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Invalid ObjectId format for volunteer or event" });
    });

    it("should assign a volunteer to an event", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/events/assign",
        body: { volunteerId: "507f1f77bcf86cd799439011", eventId: "507f1f77bcf86cd799439012" }
      });
      const res = httpMocks.createResponse();

      // Create a mock event that has a save method.
      const mockEvent = { 
        id: "507f1f77bcf86cd799439012", 
        assignedVolunteers: [], 
        save: jest.fn().mockResolvedValue(true) // Mocking save
      };
      
      jest.spyOn(Event, "findById").mockResolvedValue(mockEvent);

      await assignVolunteerToEvent(req, res);

      // After filtering, the user "507f1f77bcf86cd799439011" should be added to assignedVolunteers.
      expect(mockEvent.assignedVolunteers).toContain("507f1f77bcf86cd799439011");
      expect(mockEvent.save).toHaveBeenCalled();  // Ensure save was called
      expect(res.statusCode).toBe(200);

      // Adjust the expected result to reflect the structure that res._getJSONData() will return.
      expect(res._getJSONData()).toEqual({
        message: "Volunteer 507f1f77bcf86cd799439011 assigned to event 507f1f77bcf86cd799439012",
        event: { 
          id: "507f1f77bcf86cd799439012", 
          assignedVolunteers: ["507f1f77bcf86cd799439011"] 
        }
      });
    });

    it("should return 404 if event is not found when assigning volunteer", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/events/assign",
        body: { volunteerId: "507f1f77bcf86cd799439011", eventId: "507f1f77bcf86cd799439012" }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Event, "findById").mockResolvedValue(null);

      await assignVolunteerToEvent(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Event not found" });
    });

    it("should return 500 if an error occurs in assignVolunteerToEvent", async () => {
      const req = httpMocks.createRequest({
        method: "POST",
        url: "/api/events/assign",
        body: { volunteerId: "507f1f77bcf86cd799439011", eventId: "507f1f77bcf86cd799439012" }
      });
      const res = httpMocks.createResponse();
      jest.spyOn(Event, "findById").mockRejectedValue(new Error("Test error"));

      await assignVolunteerToEvent(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });
});
