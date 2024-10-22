// appointment.model.js
import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Reference to User model
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Doctor', // Reference to Doctor model
    },
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    appointmentNumber: {
        type: Number,
        required: true,
    },
    channelingCost: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'canceled'],
        default: 'upcoming',
    },
    patientName: {  // Add patient name field
        type: String,
        required: true,
    },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
