import express from "express";
import { toggleBookmark, getBookmarks } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// All routes protected — must be logged in
router.patch("/bookmark", authMiddleware, toggleBookmark);
router.get("/bookmarks", authMiddleware, getBookmarks);

export default router;
