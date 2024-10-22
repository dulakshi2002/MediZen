// api/__tests__/userController.test.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js'; // Your app file
import User from '../models/user.model.js';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('User Controller', () => {
    it('should create a new user successfully', async () => {
        const userData = {
            username: 'testuser',
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        };

        const response = await request(app).post('/api/auth/signup').send(userData);
        
        expect(response.status).toBe(201);
        expect(response.body.message).toBe('User created successfully');
        
        const user = await User.findOne({ email: userData.email });
        expect(user).toBeDefined();
        expect(user.username).toBe(userData.username);
    });

    it('should not create a user with duplicate email', async () => {
        const userData = {
            username: 'testuser1',
            name: 'Test User 1',
            email: 'duplicate@example.com',
            password: 'password123'
        };

        await request(app).post('/api/auth/signup').send(userData); // First user creation

        const response = await request(app).post('/api/auth/signup').send({
            username: 'testuser2',
            name: 'Test User 2',
            email: 'duplicate@example.com', // Duplicate email
            password: 'password123'
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toMatch(/Email is already in use/); // Update with the exact message returned
    });

    it('should return an error when required fields are missing', async () => {
        const response = await request(app).post('/api/auth/signup').send({
            username: 'testuser',
            // Missing name
            email: 'missingname@example.com',
            password: 'password123'
        });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/All fields are required/); // Update with the exact message returned
    });
});
