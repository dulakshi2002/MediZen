// controllers/report.controller.js
import Report from '../models/report.model.js';
import { errorHandler } from '../utils/error.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Import to use in ES modules

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// File type validation: Check if the file is a PDF or image
const isValidFileType = (file) => {
    const validMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    return validMimeTypes.includes(file.mimetype);
};

// Upload a report (Doctors only)
export const uploadReport = async (req, res, next) => {
    const { patientId, reportType, testType, reportIssuedDate } = req.body;
    
    console.log("Received patientId:", patientId); // Debug to check the value

    if (!patientId || !reportType || !testType || !reportIssuedDate || !req.file) {
        return next(errorHandler(400, 'All fields are required, including the file.'));
    }

    try {
        const newReport = new Report({
            doctor: req.user.id, // Assuming the doctor is authenticated
            patient: patientId,
            reportFile: req.file.filename,
            reportType,
            testType,
            reportIssuedDate,
        });
        await newReport.save();
        res.status(201).json({ message: 'Report uploaded successfully', report: newReport });
    } catch (error) {
        console.error("Error saving report:", error);
        next(error);
    }
};




// Get all reports for a patient (Patient can only see their own reports)
export const getReports = async (req, res, next) => {
    const userId = req.user.id; // Assuming user is authenticated
    try {
        const reports = await Report.find({ patient: userId }).populate('doctor', 'name specialization');
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
};

// Update a report (Doctors only)
export const updateReport = async (req, res, next) => {
    const { reportId } = req.params;
    const { reportType, testType, reportIssuedDate } = req.body;
    const doctorId = req.user.id;

    try {
        const report = await Report.findById(reportId);
        if (!report) return next(errorHandler(404, 'Report not found'));
        if (report.doctor.toString() !== doctorId) return next(errorHandler(403, 'Unauthorized'));

        // Update report details if provided
        if (reportType) report.reportType = reportType;
        if (testType) report.testType = testType;
        if (reportIssuedDate) report.reportIssuedDate = reportIssuedDate;

        // Handle file upload and replacement
        if (req.file) {
            if (!isValidFileType(req.file)) {
                return next(errorHandler(400, 'Invalid file type. Only PDF or image files are allowed.'));
            }

            // Construct the path for the old file
            const oldFilePath = path.join(__dirname, 'reports', report.reportFile); // Adjust according to your folder structure

            // Check if the old file exists before deleting
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            } else {
                console.warn(`File not found at path: ${oldFilePath}`);
            }

            // Update the report with the new file
            report.reportFile = req.file.filename; // Update to the new filename
        }

        await report.save();
        res.status(200).json({ message: 'Report updated successfully', report });
    } catch (error) {
        console.error("Error updating report:", error);
        return next(errorHandler(500, 'Internal Server Error'));
    }
};




// Delete a report (Doctors only)
export const deleteReport = async (req, res, next) => {
    const { reportId } = req.params;
    const doctorId = req.user.id;

    try {
        const report = await Report.findById(reportId);
        if (!report) {
            console.error(`Report with ID ${reportId} not found`);
            return next(errorHandler(404, 'Report not found'));
        }

        if (report.doctor.toString() !== doctorId) {
            console.error(`Doctor ID ${doctorId} is not authorized to delete report ${reportId}`);
            return next(errorHandler(403, 'Unauthorized'));
        }

        // Check if the report file exists before trying to delete it
        const filePath = path.join(__dirname, '..', report.reportFile);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath); // Delete the file
            } catch (fileError) {
                console.error(`Error deleting file at path: ${filePath}`);
                return next(errorHandler(500, 'Error deleting file'));
            }
        } else {
            console.error(`File not found at path: ${filePath}`);
        }

        await Report.findByIdAndDelete(reportId); // Delete the report from DB
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        console.error("Error deleting report:", error); // Log detailed error
        return next(errorHandler(500, 'Internal Server Error'));
    }
};


// Get all reports uploaded by the authenticated doctor
export const getReportsByDoctor = async (req, res, next) => {
    const doctorId = req.user.id;
    try {
        const reports = await Report.find({ doctor: doctorId })
            .populate({ path: 'patient', model: 'User', select: 'name' }); // Explicitly populate
        
        console.log("Retrieved Reports:", reports); // Debug: Check if patient names are included

        res.status(200).json(reports);
    } catch (error) {
        console.error("Error in getReportsByDoctor:", error);
        next(error);
    }
};

// Add this function in report.controller.js

export const getReportById = async (req, res, next) => {
    const { reportId } = req.params;
    try {
        const report = await Report.findById(reportId).populate('patient', 'name');
        if (!report) {
            return next(errorHandler(404, 'Report not found'));
        }
        res.status(200).json(report);
    } catch (error) {
        console.error("Error fetching report by ID:", error); // Log the error
        next(error);
    }
};


// Get all reports for a patient (Patient can only see their own reports)
export const getReportsForPatient = async (req, res, next) => {
    const userId = req.user.id; // Assuming the patient is authenticated
    try {
        const reports = await Report.find({ patient: userId }).populate('doctor', 'name specialization');
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
};
