// api/app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config(); // Load environment variables

const app = express(); // Initialize the Express app

// Middleware
app.use(express.json());
app.use(cookieParser());

// Configure CORS
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend domain
    credentials: true,               // Allow credentials like cookies, headers
}));

// MongoDB connection
const mongoURI = process.env.NODE_ENV === 'test' ? process.env.MONGO_TEST : process.env.MONGO;

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1); // Exit only if not in test environment
        }
    });

// Import routes
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import doctorRoutes from './routes/doctor.route.js';
import appointmentRoutes from './routes/appointment.route.js'; 
import contactRoutes from './routes/contactRoutes.js';
import treatmentRoutes from './routes/treatment.route.js';

// Routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', contactRoutes);
app.use("/api/treatments", treatmentRoutes);

// Global error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    });
});

// Export the app for testing
export default app;
