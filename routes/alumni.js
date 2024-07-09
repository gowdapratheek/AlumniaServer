import express from "express";
const router = express.Router();
import {
  getAllAlumni,
  createAlumni,
  updateAlumni,
  deleteAlumni,
} from "../controllers/alumni.js";

// GET all alumni
router.get("/get-all-alumni", getAllAlumni);

// POST create a new alumni
router.post("/create-alumni", createAlumni);

// PUT update alumni details
router.put("/update-alumni/:id", updateAlumni);

// DELETE delete alumni by ID
router.delete("/delete-alumni/:id", deleteAlumni);

export default router;
