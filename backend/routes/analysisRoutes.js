import express from "express";
import { getAnalysedComments } from "../controllers/analysisController.js";

const router = express.Router();

// GET /api/comments/analysis
router.get("/analysis", getAnalysedComments);

export default router;
