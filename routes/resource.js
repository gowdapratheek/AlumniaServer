import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createResource,
  getResources,
  getResourcesByUser,
  getResourceById,
} from "../controllers/resource.js";

const router = express.Router();

// Function to get current directory path in ES modules
const getCurrentDirname = () => {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
};

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(getCurrentDirname(), "../uploads");
    cb(null, uploadPath); // Set the destination folder for uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Set a unique filename with original extension
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Example: 10MB limit
});

// Routes
router.post("/resource", upload.single("file"), createResource);
router.get("/resources", getResources);
router.get("/my-resources", getResourcesByUser);
router.get("/resource/:id", getResourceById);

export default router;
