// api/__tests__/appointmentController.test.js

import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Appointment from '../models/appointment.model.js';
import User from '../models/user.model.js';
import Doctor from '../models/doctor.model.js';

let userId, doctorId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    // Ensure the test user does not already exist
    await User.deleteOne({ username: 'testuser11' });

    // Create a test user
    const user = new User({
        username: 'testuser11',
        name: 'Test User 9',
        email: 'test1user@example.com',
        password: 'password123',
    });
    const savedUser = await user.save();
    userId = savedUser._id;

    // Ensure the test doctor does not already exist
    await Doctor.deleteOne({ email: 'doctor1@example.com' });

    // Create a test doctor
    const doctor = new Doctor({
        name: 'Dr. Test Doctor',
        specialization: 'Card',
        email: 'doctor1@example.com',
        password: 'doctorpass',
        availableDates: ['2024-10-20'], // Ensure the doctor is available on the test date
        timeRanges: [{ day: 'Sunday', from: '09:00', to: '17:00' }], // Ensure the doctor is available at the test time
        maxAppointmentsPerDay: 5,
        channelingCost: 100,
    });
    const savedDoctor = await doctor.save();
    doctorId = savedDoctor._id;
});

afterEach(async () => {
    await Appointment.deleteMany({}); // Clean up appointments after each test
});

afterAll(async () => {
    await User.deleteMany({ username: 'testuser11' }); // Clean up the test user
    await Doctor.deleteMany({ email: 'doctor1@example.com' }); // Clean up the test doctor
    await mongoose.connection.close(); // Close the database connection after all tests
});

describe('Appointment Controller', () => {
    it('should create a new appointment successfully', async () => {
        const response = await request(app)
            .post('/api/appointments')
            .send({
                userId,
                doctorId,
                date: '2024-10-20T09:00:00.000Z', // Use a valid date
                channelingCost: 100,
                patientName: 'Test Patient',
                time: '09:00', // Add time field
                appointmentNumber: 1, // Set appointment number
                status: 'upcoming' // Initial status
            });

        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Appointment booked successfully');
        expect(response.body.newAppointment).toHaveProperty('_id'); // Check if appointment was created
    });

    it('should not allow booking more than the maximum number of appointments per day', async () => {
        // Create the maximum number of appointments for the doctor on the same date
        for (let i = 0; i < 5; i++) {
            await request(app)
                .post('/api/appointments')
                .send({
                    userId,
                    doctorId,
                    date: '2024-10-20T09:00:00.000Z',
                    channelingCost: 100,
                    patientName: `Patient ${i + 1}`,
                    time: '09:00', // Add time field
                    appointmentNumber: i + 1, // Set appointment number
                    status: 'upcoming' // Initial status
                });
        }

        // Now try to create another appointment which should fail
        const response = await request(app)
            .post('/api/appointments')
            .send({
                userId,
                doctorId,
                date: '2024-10-20T09:00:00.000Z',
                channelingCost: 100,
                patientName: 'Extra Patient',
                time: '09:00', // Add time field
                appointmentNumber: 6, // Set appointment number
                status: 'upcoming' // Initial status
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/No available slots for this date/);
    });

    it('should not create an appointment if the doctor is not available', async () => {
        // Simulate that the doctor is not available on the specified date
        await Doctor.findByIdAndUpdate(doctorId, {
            $pull: { availableDates: '2024-10-20' }, // Remove the specific date from availableDates
            $set: { timeRanges: [] } // Ensure no time ranges are available on that date
        });

        // Now try to create an appointment on that date
        const response = await request(app)
            .post('/api/appointments')
            .send({
                userId,
                doctorId,
                date: '2024-10-20T09:00:00.000Z', // Date when the doctor is not available
                channelingCost: 100,
                patientName: 'Unavailable Patient',
                time: '09:00', // Add time field
                appointmentNumber: 1, // Set appointment number
                status: 'upcoming' // Initial status
            });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toMatch(/Doctor not available on this date/);
    });
});
