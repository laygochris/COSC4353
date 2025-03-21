require("dotenv").config();
const httpMocks = require("node-mocks-http");
const {
  getVolunteers,
  getVolunteerById,
  matchVolunteersToEvent,
} = require("../controllers/volunteerController");
const User = require("../models/users");
const Event = require("../models/events");

jest.setTimeout(10000);

describe("Volunteer Controller", () => {
  describe("getVolunteers", () => {
    it("should fetch all volunteers successfully", async () => {
      const req = httpMocks.createRequest({ method: "GET", url: "/api/volunteers" });
      const res = httpMocks.createResponse();

      const mockVolunteers = [
        { id: "507f1f77bcf86cd799439011", username: "volunteer1", fullName: "John Doe" },
        { id: "507f1f77bcf86cd799439012", username: "volunteer2", fullName: "Jane Smith" },
      ];

      jest.spyOn(User, "find").mockReturnValue({
        select: jest.fn().mockResolvedValue(mockVolunteers),
      });

      await getVolunteers(req, res);
      expect(User.find).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockVolunteers);
    });

    it("should return 500 if an error occurs in getVolunteers", async () => {
      const req = httpMocks.createRequest({ method: "GET", url: "/api/volunteers" });
      const res = httpMocks.createResponse();

      jest.spyOn(User, "find").mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error("Test error")),
      });

      await getVolunteers(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("getVolunteerById", () => {
    it("should return 400 for invalid volunteer ID format", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/invalid-id",
        params: { volunteerId: "invalid-id" },
      });
      const res = httpMocks.createResponse();

      await getVolunteerById(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Invalid volunteer ID format" });
    });

    it("should return volunteer by ID", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/507f1f77bcf86cd799439011",
        params: { volunteerId: "507f1f77bcf86cd799439011" },
      });
      const res = httpMocks.createResponse();

      const mockVolunteer = {
        _id: "507f1f77bcf86cd799439011",
        username: "volunteer1",
        fullName: "John Doe",
      };

      jest.spyOn(User, "findById").mockReturnValue({
        select: jest.fn().mockResolvedValue(mockVolunteer),
      });

      await getVolunteerById(req, res);
      expect(User.findById).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(mockVolunteer);
    });

    it("should return 404 if volunteer not found", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/507f1f77bcf86cd799439011",
        params: { volunteerId: "507f1f77bcf86cd799439011" },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(User, "findById").mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await getVolunteerById(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Volunteer not found" });
    });

    it("should return 500 if an error occurs in getVolunteerById", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/507f1f77bcf86cd799439011",
        params: { volunteerId: "507f1f77bcf86cd799439011" },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(User, "findById").mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error("Test error")),
      });

      await getVolunteerById(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });

  describe("matchVolunteersToEvent", () => {
    it("should return 400 for invalid volunteer ID format", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/match/invalid-id",
        params: { volunteerId: "invalid-id" },
      });
      const res = httpMocks.createResponse();

      await matchVolunteersToEvent(req, res);
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: "Invalid ObjectId format for volunteer" });
    });

    it("should return matched events for volunteer", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/match/507f1f77bcf86cd799439011",
        params: { volunteerId: "507f1f77bcf86cd799439011" },
      });
      const res = httpMocks.createResponse();

      const mockVolunteer = {
        _id: "507f1f77bcf86cd799439011",
        skills: ["JavaScript", "Node.js"],
      };

      const mockEvent = {
        _id: "507f1f77bcf86cd799439012",
        requiredSkills: ["JavaScript", "React"],
        toObject: () => ({ _id: "507f1f77bcf86cd799439012", requiredSkills: ["JavaScript", "React"] }),
      };

      jest.spyOn(User, "findById").mockReturnValue({
        select: jest.fn().mockResolvedValue(mockVolunteer),
      });
      jest.spyOn(Event, "find").mockResolvedValue([mockEvent]);

      await matchVolunteersToEvent(req, res);
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData().matchedEvents).toHaveLength(1);
    });

    it("should return 404 if volunteer not found", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/match/507f1f77bcf86cd799439011",
        params: { volunteerId: "507f1f77bcf86cd799439011" },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(User, "findById").mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await matchVolunteersToEvent(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Volunteer not found" });
    });

    it("should return 500 if an error occurs in matchVolunteersToEvent", async () => {
      const req = httpMocks.createRequest({
        method: "GET",
        url: "/api/volunteers/match/507f1f77bcf86cd799439011",
        params: { volunteerId: "507f1f77bcf86cd799439011" },
      });
      const res = httpMocks.createResponse();

      jest.spyOn(User, "findById").mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error("Test error")),
      });

      await matchVolunteersToEvent(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Internal server error" });
    });
  });
});
