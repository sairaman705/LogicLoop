import express from "express";
import { fetchAndSaveNews, getAllNews, getArticleById  } from "../controllers/newsController.js";

const router = express.Router();

router.get("/", getAllNews); // GET /api/news
router.get("/fetch", fetchAndSaveNews); // Trigger API fetch
router.get("/:id", getArticleById);

export default router;
