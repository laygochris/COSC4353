const request = require('supertest');
const express = require('express');
const { getVolunteers, createVolunteer, matchVolunteersToEvent } = require('../controllers/volunteerController');
const { createVolunteerValidation, matchVolunteersToEventValidation } = require('../validators/volunteerValidator');
const verifyToken = require('../middleware/verifyToken');

const app = express();
app.use(express.json());
app.get('/api/volunteers', verifyToken, getVolunteers);
app.post('/api/volunteers/create', verifyToken, ...createVolunteerValidation, createVolunteer);
app.get('/api/volunteers/match/:volunteerId', verifyToken, ...matchVolunteersToEventValidation, matchVolunteersToEvent);

jest.mock('../middleware/verifyToken', () => (req, res, next) => {
  req.user = { id: 1 }; // Mock user ID for testing
  next();
});

describe('Volunteer Controller', () => {
  it('should get all volunteers', async () => {
    const response = await request(app).get('/api/volunteers');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should create a new volunteer', async () => {
    const response = await request(app)
      .post('/api/volunteers/create')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        skills: ['Communication', 'Teamwork']
      });
    expect(response.status).toBe(201);
    expect(response.body.firstName).toBe('Jane');
  });

  it('should match volunteer to events', async () => {
    const response = await request(app).get('/api/volunteers/match/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('volunteer');
    expect(response.body).toHaveProperty('matchedEvents');
  });
});