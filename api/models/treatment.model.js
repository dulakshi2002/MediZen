import mongoose from "mongoose";

const treatmentSchema = new mongoose.Schema({
  treatmentName: {
    type: String,
    required: true,
  }, // Name of the treatment, e.g., "Physiotherapy", "Chemotherapy", etc.
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }, // Reference to the patient receiving the treatment
  prescribedDate: {
    type: Date,
    required: true,
  }, // Date when the treatment was prescribed
  doctorName: {
    type: String,
    required: true,
  }, // Name of the doctor prescribing the treatment
  description: {
    type: String,
    required: true,
  }, // Additional details about the treatment, such as dosage, instructions, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  }, // Automatically records the date the treatment record is created
});

const Treatment = mongoose.model("Treatment", treatmentSchema);
export default Treatment;
