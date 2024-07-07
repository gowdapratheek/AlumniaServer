import express from "express";
const router = express.Router();

import { getAllPosts, hostevent } from "../controllers/posts.js";

import { auth } from "../middleware/auth.js";

// these routes can only be accessed by authenticated users
router.get("/get-all-posts", getAllPosts);
router.get("/get-all-posts", hostevent);

export default router;
