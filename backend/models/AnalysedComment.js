import mongoose from "mongoose";

const analysedCommentSchema = new mongoose.Schema({
  videoId: { type: String, required: true },
  commentId: { type: String, required: true, unique: true },
  comment: { type: String, required: true },
  author: { type: String, required: true },
  publishedAt: { type: Date, required: true },
  sentiment: { type: String, enum: ["positive", "negative", "neutral"], required: true },
  summary: { type: String, required: true },
  keywords: { type: [String], default: [] },
  improvement: { type: String, default: "N/A" }
}, {
  timestamps: true,
  collection: "analyzedComments" // 👈 Fix: Use exact MongoDB collection name
});

export default mongoose.model("AnalysedComment", analysedCommentSchema);
