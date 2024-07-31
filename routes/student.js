import express from "express";
import multer from "multer";
import {
  getStudentDetails,
  createStudent,
  updateStudentDetails,
  deleteStudent,
  getAllStudentDetails,
} from "../controllers/student.js";
import StudentPersonalDetails from "../model/student.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Example: 10MB limit
});

// GET all student details
router.get("/all-student", getAllStudentDetails);

router.get("/get-student-details", getStudentDetails);

// POST create a new student
router.post("/create-student", createStudent);

// PUT update student details (including file upload handling)
router.put(
  "/update-student-details",
  upload.single("photo"),
  updateStudentDetails
);

// DELETE delete student by ID
router.delete("/delete-student/:id", deleteStudent);

export default router;
