// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { googleLogin } from "../controllers/authController.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, (req, res) => {
    res.status(200).json({
      msg: "🔐 You are authenticated!",
      user: req.user,
    });
  });

export default router;
router.post("/google-login", googleLogin);
