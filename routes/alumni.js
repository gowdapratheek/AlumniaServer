import express from "express";
import multer from "multer";
import {
  getAlumniDetails,
  createAlumni,
  updateAlumniDetails,
  deleteAlumni,
} from "../controllers/alumni.js";
import AlumniPersonalDetails from "../model/alumni.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // Example: 10MB limit
});

// GET all alumni details
router.get("/get-alumni-details", getAlumniDetails);

// POST create a new alumni
router.post("/create-alumni", createAlumni);

// PUT update alumni details (including file upload handling)
router.put(
  "/update-alumni-details",
  upload.single("photo"),
  updateAlumniDetails
);

// DELETE delete alumni by ID
router.delete("/delete-alumni/:id", deleteAlumni);

export default router;
