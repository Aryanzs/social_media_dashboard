// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import admin from "../config/firebase.js";

// JWT Token Generator
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(newUser._id);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const googleLogin = async (req, res) => {
    const { idToken } = req.body;
  
    try {
      // 1. Verify Firebase ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { name, email, uid } = decodedToken;
  
      // 2. Check if user exists
      let user = await User.findOne({ email });
  
      // 3. If not, create one
      if (!user) {
        user = await User.create({
          name,
          email,
          googleId: uid,
        });
      }
  
      // 4. Generate our JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
  
      res.status(200).json({ user, token });
    } catch (error) {
      console.error("❌ Firebase token error:", error.message);
      res.status(401).json({ msg: "Invalid Google token" });
    }
  };
  
