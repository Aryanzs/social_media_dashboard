// server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import cors from "cors";


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});


app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Backend API is running");
});

import youtubeRoutes from "./routes/youtubeRoutes.js";
app.use("/api/youtube", youtubeRoutes);

app.use("/api/comments", analysisRoutes);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
