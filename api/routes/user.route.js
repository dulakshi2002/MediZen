import express from "express";
import {
  test,
  updateUser,
  deleteUser,
  verifyAdmin,
  getAllUsers,
  getAllNonDoctorsAndAdmins,
  getAllPatients,
  updateUserAttributes, // Import the new update function
  getUserAttributes, // Import the new get function
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/", test);
router.post("/update/:id", verifyToken, updateUser);
router.put("/update-attributes/:id", verifyToken, updateUserAttributes); // New route for updating specific attributes
router.get("/attributes/:id", verifyToken, getUserAttributes); // New route for fetching specific attributes
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/all", verifyToken, getAllUsers);
router.get("/allPatients", verifyToken, getAllPatients);

router.get("/admin", verifyToken, verifyAdmin, (req, res) => {
  res.json("Admin route, only accessible by admin.");
});

export default router;
