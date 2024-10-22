// appointment.route.js
import express from 'express';
import {
    createAppointment,
    getUserAppointments,
    updateAppointment,
    deleteAppointment,
    getAvailableDoctors,
    getDoctorAppointments,
} from '../controllers/appointment.controller.js';

const router = express.Router();

// POST: Create a new appointment
router.post('/', createAppointment);

// GET: Get all appointments for a user
router.get('/user/:userId', getUserAppointments);

// PUT: Update an appointment
router.put('/:id', updateAppointment);

// DELETE: Delete an appointment
router.delete('/:id', deleteAppointment);

// GET: Get available doctors for a specific date and specialization
router.get('/available', getAvailableDoctors);

// appointment.route.js
router.get('/doctor/:doctorId', getDoctorAppointments);

export default router;
