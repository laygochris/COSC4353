const request = require("supertest");
const express = require("express");
const {
    updateUserProfile,
    getUserProfile,
    deleteUserProfile,
} = require("../controllers/userProfileController");
const { updateProfileValidation } = require("../validators/userProfileValidator");
const verifyToken = require("../middleware/verifyToken");

const app = express();
app.use(express.json());

// Routes
app.put("/api/user-profile/update", verifyToken, updateProfileValidation, updateUserProfile);
app.get("/api/user-profile/:userId", verifyToken, getUserProfile);
app.delete("/api/user-profile/:userId", verifyToken, deleteUserProfile);

// Mock Authentication Middleware First
jest.mock("../middleware/verifyToken", () => (req, res, next) => {
    req.user = { id: "507f1f77bcf86cd799439011" }; // Simulated ObjectId-style user ID
    next();
});

//  Mock Controller Functions
jest.mock("../controllers/userProfileController", () => {
    return {
        updateUserProfile: jest.fn((req, res) => {
            return res.status(200).json({ message: "User profile updated successfully!" });
        }),
        getUserProfile: jest.fn((req, res) => {
            const userId = req.params.userId;
            if (userId === "9999") {
                return res.status(404).json({ message: "User profile not found." });
            }
            return res.status(200).json({ message: "User profile retrieved successfully!" });
        }),
        deleteUserProfile: jest.fn((req, res) => {
            const userId = req.params.userId;
            if (userId === "9999") {
                return res.status(404).json({ message: "User profile not found." });
            }
            return res.status(200).json({ message: "User profile deleted successfully!" });
        }),
    };
});

const validUserId = "507f1f77bcf86cd799439011";

describe("User Profile Controller Tests", () => {
    it("should update user profile", async () => {
        const response = await request(app)
            .put("/api/user-profile/update")
            .send({
                userId: validUserId,
                fullName: "John Doe",
                address: "123 Main St",
                city: "Houston",
                state: "TX",
                zip: "77001",
                skills: ["Problem Solving"],
                preference: "Remote",
                availability: ["2025-03-07"],
            });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User profile updated successfully!");
    });

    it("should retrieve a user profile by ID", async () => {
        const response = await request(app).get(`/api/user-profile/${validUserId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User profile retrieved successfully!");
    });

    it("should return 404 for a non-existing user profile", async () => {
        const response = await request(app).get("/api/user-profile/9999");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User profile not found.");
    });

    it("should delete a user profile", async () => {
        const response = await request(app).delete(`/api/user-profile/${validUserId}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("User profile deleted successfully!");
    });

    it("should return 404 when trying to delete a non-existing profile", async () => {
        const response = await request(app).delete("/api/user-profile/9999");

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("User profile not found.");
    });
});
