const request = require('supertest');
const express = require('express');
const { updateUserProfile, getUserProfile, deleteUserProfile } = require('../controllers/userProfileController');
const { updateProfileValidation } = require('../validators/userProfileValidator');
const verifyToken = require('../middleware/verifyToken');

const app = express();
app.use(express.json());
app.put('/api/user-profile/update', verifyToken, updateProfileValidation, updateUserProfile);
app.get('/api/user-profile/:userId', verifyToken, getUserProfile);
app.delete('/api/user-profile/:userId', verifyToken, deleteUserProfile);

jest.mock('../middleware/verifyToken', () => (req, res, next) => {
  req.user = { id: 1 }; // Mock user ID for testing
  next();
});

describe('User Profile Controller', () => {
  it('should update user profile', async () => {
    const response = await request(app)
      .put('/api/user-profile/update')
      .send({
        userId: 1,
        fullName: 'John Doe',
        address: '123 Main St',
        city: 'Houston',
        state: 'TX',
        zip: '77001',
        skills: ['Problem Solving'],
        preference: 'Remote',
        availability: ['2025-03-07']
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User profile updated successfully!');
  });

  it('should get user profile', async () => {
    const response = await request(app).get('/api/user-profile/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User profile retrieved successfully!');
  });

  it('should delete user profile', async () => {
    const response = await request(app).delete('/api/user-profile/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User profile deleted successfully!');
  });
});