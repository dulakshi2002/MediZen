import Doctor from '../models/doctor.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

// Add a new doctor
export const addDoctor = async (req, res) => {
  const { name, specialization, email, password, availableDates, timeRanges, maxAppointmentsPerDay, channelingCost } = req.body;

  // Input validation
  if (!name || !specialization || !email || !password || !availableDates || !timeRanges || !maxAppointmentsPerDay || !channelingCost) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  try {
    // Check if the email is already in use by another doctor
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Email is already in use by another doctor' });
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new doctor instance
    const newDoctor = new Doctor({
      name,
      specialization,
      email,
      password: hashedPassword, // Store the hashed password
      availableDates, // Array of available days
      timeRanges, // Object containing time ranges
      maxAppointmentsPerDay,
      channelingCost,
    });

    // Save the new doctor to the database
    await newDoctor.save();
    
    // Respond with success message
    res.status(201).json({ success: true, message: 'Doctor added successfully' });
  } catch (error) {
    console.error('Error creating doctor:', error);
    return res.status(500).json({ success: false, message: 'Error creating doctor', error: error.message });
  }
};


// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching doctors', error: err.message });
  }
};

// Update a doctor
// Update a doctor
export const updateDoctor = async (req, res) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor updated successfully', updatedDoctor });
  } catch (err) {
    res.status(500).json({ message: 'Error updating doctor', error: err.message });
  }
};


// Delete a doctor
export const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting doctor', error: err.message });
  }
};

// Get a specific doctor by ID
export const getDoctor = async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
      res.json(doctor);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching doctor', error: err.message });
    }
  };
  