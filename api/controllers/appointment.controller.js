// appointment.controller.js
import Appointment from '../models/appointment.model.js';
import Doctor from '../models/doctor.model.js';
import User from '../models/user.model.js';


export const createAppointment = async (req, res) => {
    const { userId, doctorId, date, channelingCost, patientName } = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

        const appointmentCount = await Appointment.countDocuments({
            doctorId,
            date,
            status: 'upcoming',
        });

        if (appointmentCount >= doctor.maxAppointmentsPerDay) {
            return res.status(400).json({ success: false, message: 'No available slots for this date' });
        }

        const appointmentDay = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        const timeRange = doctor.timeRanges.find(range => range.day.toLowerCase() === appointmentDay);

        if (!timeRange) {
            return res.status(400).json({ success: false, message: 'Doctor not available on this date' });
        }

        // Create a new appointment with the next available number
        const newAppointment = new Appointment({
            userId,
            doctorId,
            date,
            time: timeRange.from,
            appointmentNumber: appointmentCount + 1,
            channelingCost,
            patientName,
        });

        await newAppointment.save();
        res.status(201).json({ success: true, message: 'Appointment booked successfully', newAppointment });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Error creating appointment', error: error.message });
    }
};

// Update the appointment number after cancellation
export const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Adjust other appointments' numbers
        await Appointment.updateMany(
            {
                doctorId: appointment.doctorId,
                date: appointment.date,
                appointmentNumber: { $gt: appointment.appointmentNumber },
            },
            { $inc: { appointmentNumber: -1 } }
        );

        res.json({ message: 'Appointment canceled and numbers updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting appointment', error: error.message });
    }
};
// Get appointments for a specific user
export const getUserAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.userId })
            .populate('doctorId', 'name specialization timeRanges'); // Populate doctor details
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
};

// Update an appointment
// Update an appointment
// Update an appointment
export const updateAppointment = async (req, res) => {
    try {
        const { doctorId, date } = req.body;
        const appointmentId = req.params.id;

        // Fetch the current appointment
        const currentAppointment = await Appointment.findById(appointmentId);
        if (!currentAppointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // If rescheduling to a different date, check availability only for the new date
        if (currentAppointment.date.toISOString() !== new Date(date).toISOString()) {
            // Fetch the doctor to validate available days
            const doctor = await Doctor.findById(doctorId);
            if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

            const selectedDay = new Date(date).toLocaleString('en-US', { weekday: 'long' });

            // Check if the selected date matches the doctor's available days
            const isAvailable = doctor.timeRanges.some((range) => range.day === selectedDay);
            if (!isAvailable) {
                return res.status(400).json({ message: `Doctor is not available on ${selectedDay}` });
            }

            // Get all existing appointments for the selected doctor on the selected date
            const appointmentsForSelectedDate = await Appointment.find({
                doctorId,
                date,
                status: 'upcoming',
            });

            // Check if the doctor is fully booked on the selected date
            if (appointmentsForSelectedDate.length >= doctor.maxAppointmentsPerDay) {
                return res.status(400).json({ message: 'Doctor is fully booked on this date' });
            }

            // Adjust appointment numbers for the old date (if the date is changing)
            const appointmentsForOldDate = await Appointment.find({
                doctorId: currentAppointment.doctorId,
                date: currentAppointment.date,
                status: 'upcoming',
                appointmentNumber: { $gt: currentAppointment.appointmentNumber }
            });

            // Update the appointment numbers for patients booked later on the original date
            for (let appointment of appointmentsForOldDate) {
                appointment.appointmentNumber -= 1; // Shift the number down
                await appointment.save();
            }

            // Assign the new appointment number for the new date
            req.body.appointmentNumber = appointmentsForSelectedDate.length + 1; // New number for the new date
        }

        // Update the appointment with the new date and number
        const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, req.body, { new: true });

        res.json({ success: true, message: 'Appointment updated successfully', updatedAppointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating appointment', error: error.message });
    }
};




// Get available doctors for a specific date and specialization
export const getAvailableDoctors = async (req, res) => {
    const { date, specialization } = req.query;

    try {
        const doctors = await Doctor.find({ specialization });
        const availableDoctors = [];

        for (const doctor of doctors) {
            const appointmentCount = await Appointment.countDocuments({
                doctorId: doctor._id,
                date,
                status: 'upcoming',
            });

            if (appointmentCount < doctor.maxAppointmentsPerDay) {
                availableDoctors.push(doctor);
            }
        }

        res.json(availableDoctors);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching available doctors', error: error.message });
    }
};

// appointment.controller.js
export const getDoctorAppointments = async (req, res) => {
    const { doctorId } = req.params;
    const { date } = req.query; // Get the date from the query parameters

    try {
        // Define a query object for Mongoose
        let query = { doctorId };

        // Helper function to get the start of the current week (Monday)
        const getWeekStart = (date) => {
            const currentDate = new Date(date);
            const dayOfWeek = currentDate.getDay();
            const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Handle Sunday as day 0
            const weekStart = new Date(currentDate.setDate(currentDate.getDate() + mondayOffset));
            weekStart.setHours(0, 0, 0, 0); // Set time to midnight
            return weekStart;
        };

        if (date) {
            // If a specific date is provided, filter appointments by that date
            const selectedDate = new Date(date);
            query.date = {
                $gte: selectedDate.setHours(0, 0, 0, 0), // Start of the day
                $lt: selectedDate.setHours(23, 59, 59, 999), // End of the day
            };
        } else {
            // If no specific date, fetch appointments for this week and future dates
            const weekStart = getWeekStart(new Date());
            query.date = {
                $gte: weekStart // Start of the current week
            };
        }

        // Fetch appointments from the database
        const appointments = await Appointment.find(query).populate('userId', 'name');
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({ message: 'Error fetching appointments' });
    }
};




