// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String, // Optional for Google users
  },
  googleId: {
    type: String, // Optional for Google OAuth
  },
  socialTokens: {
    twitter: { type: Object },
    instagram: { type: Object },
    youtube: {
      access_token: String,
      refresh_token: String,
      expiry_date: Number,
    },
  },
  
}, { timestamps: true });

export default mongoose.model("User", userSchema);
