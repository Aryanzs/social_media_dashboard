import express from "express";
import { getYouTubeAuthUrl, handleYouTubeCallback,fetchYouTubeAnalytics,fetchYouTubeTimeline } from "../controllers/youtubeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes
router.get("/auth-url", protect, getYouTubeAuthUrl);
router.post("/callback", protect, handleYouTubeCallback);
router.get("/analytics", protect, fetchYouTubeAnalytics);
router.get("/analytics/timeline", protect, fetchYouTubeTimeline);


export default router;
