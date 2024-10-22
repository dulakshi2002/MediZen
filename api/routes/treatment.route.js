import express from "express";
import {
  addTreatment,
  getTreatments,
  updateTreatment,
  deleteTreatment,
} from "../controllers/treatment.controller.js";

const router = express.Router();

// POST: Add a new treatment
router.post("/add", addTreatment);

// GET: Get all treatments for a patient
router.get("/:userId", getTreatments);

// PUT: Update a treatment by ID
router.put("/update/:treatmentId", updateTreatment);

// DELETE: Delete a treatment by ID
router.delete("/delete/:treatmentId", deleteTreatment);

export default router;
