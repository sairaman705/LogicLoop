import express from "express";
import { summarizeArticle, chatWithArticle  } from "../controllers/aiController.js";

const router = express.Router();

router.post("/summarize", summarizeArticle);
router.post("/chat", chatWithArticle);

export default router;
