import express from 'express';
import { 
  uploadReport, 
  getReports, 
  updateReport, 
  deleteReport, 
  getReportsByDoctor,
  getReportById,
  getReportsForPatient
} from '../controllers/report.controller.js';
import { verifyToken, verifyDoctor } from '../utils/verifyUser.js'; // Assume verifyDoctor checks if the user is a doctor
import multer from 'multer'; // Middleware for handling file uploads
import path from 'path'; // Import path for handling file directories
import fs from 'fs';
import { fileURLToPath } from 'url'; // Required for __dirname in ES modules

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the destination folder for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'reports');
    
    // Check if the directory exists, and create it if it doesn't
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir); // Store the file in 'reports' folder
  },
  filename: (req, file, cb) => {
    // Use Date.now() to ensure each file has a unique name
    const uniqueSuffix = Date.now() + '-' + file.originalname;
    cb(null, uniqueSuffix); // The file will be named with the original name + timestamp
  }
});

// Initialize multer with the defined storage configuration
const upload = multer({ storage: storage });

const router = express.Router();

// POST: Doctor uploads a report
router.post('/upload', verifyToken, verifyDoctor, upload.single('reportFile'), uploadReport);

// GET: Patient gets their own reports
router.get('/patient', verifyToken, getReports);

// PUT: Doctor updates a report
router.put('/:reportId', verifyToken, verifyDoctor, upload.single('reportFile'), updateReport);

// DELETE: Doctor deletes a report
router.delete('/:reportId', verifyToken, verifyDoctor, deleteReport);

// GET: Doctor gets their own uploaded reports
router.get('/doctor', verifyToken, verifyDoctor, getReportsByDoctor);

// Add this route in report.route.js to fetch a single report by ID
router.get('/:reportId', verifyToken, getReportById);

// Add this line for patient reports
router.get('/patient', verifyToken, getReportsForPatient); 

export default router;
