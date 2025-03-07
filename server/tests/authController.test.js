const request = require('supertest');
const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/logregValidator');

const app = express();
app.use(express.json());
app.post('/api/register', registerValidation, registerUser);
app.post('/api/login', loginValidation, loginUser);

describe('Auth Controller', () => {
  let testEmail;
  let testUsername;

  // Generate a unique suffix for each test run
  beforeAll(() => {
    const uniqueTag = Date.now().toString(); 
    testEmail = `john.doe.${uniqueTag}@example.com`;
    testUsername = `johndoe_${uniqueTag}`;
  });

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        firstName: 'Sarah',
        lastName: 'Doe',
        email: testEmail,        // Use random email
        username: testUsername,  // Use random username
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully!');
  });

  it('should login an existing user', async () => {
    // Must match email from the registration test
    const response = await request(app)
      .post('/api/login')
      .send({
        email: testEmail,
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful!');
  });
});
