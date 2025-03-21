require('dotenv').config(); // Load env variables
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { registerUser, loginUser, formatUserResponse } = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../validators/logregValidator');
const User = require('../models/users');

// We use Jest to mock the User model
jest.mock('../models/users');

const app = express();
app.use(express.json());
app.post('/api/register', registerValidation, registerUser);
app.post('/api/login', loginValidation, loginUser);

describe('Auth Controller', () => {
  let testEmail;
  let testUsername;

  beforeAll(() => {
    const uniqueTag = Date.now().toString(); 
    testEmail = `john.doe.${uniqueTag}@example.com`;
    testUsername = `johndoe_${uniqueTag}`;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return validation errors on register', async () => {
    // Sending an empty request to trigger validation errors
    const response = await request(app)
      .post('/api/register')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should register a new user', async () => {
    // Simulate no existing user
    User.findOne.mockResolvedValue(null);
    // Simulate saving the new user: use the actual user object that would be returned by Mongoose
    User.prototype.save = jest.fn().mockResolvedValue(true);
    // Also simulate the return value of User.create()
    User.create.mockImplementation((userData) => Promise.resolve({
      _id: 'uniqueId123',
      username: userData.username,
      email: userData.email,
      userType: userData.userType,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    
    const response = await request(app)
      .post('/api/register')
      .send({
        firstName: 'Sarah',
        lastName: 'Doe',
        email: testEmail,
        username: testUsername,
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully!');
    expect(response.body.userCredential).toBeDefined();
  });

  it('should return duplicate error when registering an existing user', async () => {
    // Simulate an existing user is found
    User.findOne.mockResolvedValue({ username: testUsername });
    
    const response = await request(app)
      .post('/api/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: testEmail,
        username: testUsername,
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists.');
  });

  it('should handle registration errors (catch block)', async () => {
    // Simulate no existing user, but force an error when saving
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockRejectedValue(new Error('Test error'));
    
    const response = await request(app)
      .post('/api/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: testEmail,
        username: testUsername + '_new',
        password: 'password123',
      });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should return validation errors on login', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.errors).toBeDefined();
  });

  it('should return email invalid when user not found on login', async () => {
    // Simulate that no user is found
    User.findOne.mockResolvedValue(null);
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'notfound@example.com',
        password: 'password123',
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Email invalid.');
  });

  it('should return password invalid when password does not match', async () => {
    // Simulate a found user with a hashed password that won't match "wrongpassword"
    User.findOne.mockResolvedValue({
      _id: 'uniqueId123',
      email: 'user@example.com',
      password: '$2b$10$invalidhashforwrongpassword', // This hash will not match "wrongpassword"
      userType: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'user@example.com',
        password: 'wrongpassword',
      });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Password invalid.');
  });

  it('should handle login errors (catch block)', async () => {
    // Simulate an error in findOne
    User.findOne.mockRejectedValue(new Error('Test login error'));
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'user@example.com',
        password: 'password123',
      });
    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

  it('should login an existing user successfully', async () => {
    // Simulate found user with a valid bcrypt-hash for "password123"
    const validHash = await require('bcrypt').hash('password123', 10);
    User.findOne.mockResolvedValue({
      _id: 'uniqueId123',
      email: testEmail,
      username: testUsername,
      password: validHash,
      userType: 'volunteer',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post('/api/login')
      .send({
        email: testEmail,
        password: 'password123',
      });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Login successful!');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });
});
