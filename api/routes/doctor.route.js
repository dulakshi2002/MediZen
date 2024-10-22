import express from 'express';
import {
  addDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctor.controller.js';

const router = express.Router();

// POST: Add a new doctor
router.post('/add', addDoctor); // Ensure this line exists

// GET: Get all doctors
router.get('/', getDoctors);

// GET: Get a specific doctor by ID
router.get('/doc/:id', getDoctor);

// PUT: Update a doctor
router.put('/update/:id', updateDoctor);

// DELETE: Delete a doctor
router.delete('/delete/:id', deleteDoctor);


export default router;
