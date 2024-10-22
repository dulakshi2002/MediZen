import Treatment from "../models/treatment.model.js";
import User from "../models/user.model.js"; // Ensure User model is imported
import nodemailer from "nodemailer";
import { errorHandler } from "../utils/error.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sachinthaakarawita@gmail.com",
    pass: "qzir naio drrq tnvk",
  },
});

export const addTreatment = async (req, res, next) => {
  const { treatmentName, patientId, prescribedDate, doctorName, description } =
    req.body;

  if (
    !treatmentName ||
    !patientId ||
    !prescribedDate ||
    !doctorName ||
    !description
  ) {
    return next(errorHandler(400, "All fields are required."));
  }

  try {
    // Create and save new treatment
    const newTreatment = new Treatment({
      treatmentName,
      patient: patientId,
      prescribedDate,
      doctorName,
      description,
    });
    await newTreatment.save();

    // Fetch the patient's email
    const patient = await User.findById(patientId);
    if (patient && patient.email) {
      // Send an email notification
      const mailOptions = {
        from: "sachinthaakarawita@gmail.com", // Update to match the user in transporter
        to: patient.email,
        subject: "New Treatment Added",
        text: `Dear ${patient.username},\n\nA new treatment "${treatmentName}" has been added to your record.\n\nBest Regards,\nYour Health Care Team`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
    }

    // Send a response to the client after adding treatment
    res.status(201).json({
      message: "Treatment added successfully",
      treatment: newTreatment,
    });
  } catch (error) {
    console.error("Error adding treatment:", error);
    next(error);
  }
};

export const getTreatments = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const treatments = await Treatment.find({ patient: userId })
      .populate("patient", "username")
      .sort({ createdAt: -1 }); // Sort treatments by `createdAt` in descending order

    const patientName =
      treatments.length > 0 ? treatments[0].patient.username : "";

    res.status(200).json({ treatments, patientName });
  } catch (error) {
    next(error);
  }
};

export const updateTreatment = async (req, res, next) => {
  const { treatmentId } = req.params;
  const { treatmentName, prescribedDate, doctorName, description } = req.body;

  try {
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return next(errorHandler(404, "Treatment not found"));

    if (treatmentName) treatment.treatmentName = treatmentName;
    if (prescribedDate) treatment.prescribedDate = prescribedDate;
    if (doctorName) treatment.doctorName = doctorName;
    if (description) treatment.description = description;

    await treatment.save();
    res
      .status(200)
      .json({ message: "Treatment updated successfully", treatment });
  } catch (error) {
    next(error);
  }
};

export const deleteTreatment = async (req, res, next) => {
  const { treatmentId } = req.params;

  try {
    const treatment = await Treatment.findById(treatmentId);
    if (!treatment) return next(errorHandler(404, "Treatment not found"));

    await Treatment.findByIdAndDelete(treatmentId);
    res.status(200).json({ message: "Treatment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
