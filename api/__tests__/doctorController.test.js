// api/__tests__/doctorController.test.js
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Doctor from '../models/doctor.model.js';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterEach(async () => {
    await Doctor.deleteMany({});
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Doctor Controller', () => {
    it('should add a new doctor successfully (Positive Case)', async () => {
        const response = await request(app)
            .post('/api/doctors/add')
            .send({
                name: 'Dr. John Doe',
                specialization: 'Cardiology',
                email: 'john.doe@example.com',
                password: 'password123',
                availableDates: ['Monday', 'Tuesday'],
                timeRanges: [{ day: 'Monday', from: '09:00', to: '17:00' }],
                maxAppointmentsPerDay: 5,
                channelingCost: 100,
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        
        const doctor = await Doctor.findOne({ email: 'john.doe@example.com' });
        expect(doctor).toBeTruthy();
        expect(doctor.name).toBe('Dr. John Doe');
    });

    it('should not add a doctor with a duplicate email (Negative Case)', async () => {
        await request(app)
            .post('/api/doctors/add')
            .send({
                name: 'Dr. John Doe',
                specialization: 'Cardiology',
                email: 'john.doe@example.com',
                password: 'password123',
                availableDates: ['Monday', 'Tuesday'],
                timeRanges: [{ day: 'Monday', from: '09:00', to: '17:00' }],
                maxAppointmentsPerDay: 5,
                channelingCost: 100,
            });

        const response = await request(app)
            .post('/api/doctors/add')
            .send({
                name: 'Dr. Jane Doe',
                specialization: 'Dermatology',
                email: 'john.doe@example.com', // Duplicate email
                password: 'password456',
                availableDates: ['Wednesday', 'Thursday'],
                timeRanges: [{ day: 'Wednesday', from: '10:00', to: '16:00' }],
                maxAppointmentsPerDay: 3,
                channelingCost: 80,
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/Email is already in use by another doctor/);
    });

    it('should return an error when required fields are missing (Negative Case)', async () => {
        const response = await request(app)
            .post('/api/doctors/add')
            .send({
                specialization: 'Cardiology',
                email: 'john.doe@example.com',
                password: 'password123',
                availableDates: ['Monday', 'Tuesday'],
                timeRanges: [{ day: 'Monday', from: '09:00', to: '17:00' }],
                maxAppointmentsPerDay: 5,
                channelingCost: 100,
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/All fields are required/);
    });
});
