import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    doctor: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Doctor', 
        required: true 
    },
    patient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    reportFile: { 
        type: String, 
        required: true 
    }, // Path to the uploaded report file
    reportType: { 
        type: String, 
        required: true 
    }, // E.g., "Blood Test", "X-Ray", etc.
    testType: { 
        type: String, 
        required: true 
    },   // Specific test, e.g., "CBC", "Chest X-Ray"
    reportIssuedDate: { 
        type: Date, 
        required: true 
    }, // Date the report was issued
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

const Report = mongoose.model('Report', reportSchema);
export default Report;
