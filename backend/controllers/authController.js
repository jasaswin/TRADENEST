
// // backend/controllers/authController.js
// const User = require('../model/UserModel');
// const jwt = require('jsonwebtoken');

// const JWT_SECRET = process.env.JWT_SECRET || 'change_this';

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Basic validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Check existing user
//     const existing = await User.findOne({ email });
//     if (existing) return res.status(409).json({ message: 'Email already registered' });

//     const user = new User({ name, email, password });
//     await user.save();

//     // Create JWT
//     const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

//     // Send token as JSON (or set as httpOnly cookie)
//     res.status(201).json({ message: 'User created', token, user: { id: user._id, name: user.name, email: user.email } });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };





// // backend/controllers/authController.js
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import UserModel from "../model/UserModel.js";

// const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_for_prod";

// export const signup = async (req, res) => {
//   try {
//     const { username, email, password } = req.body || {};
//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "Username, email and password are required." });
//     }

//     const normalizedEmail = (email || "").toString().trim().toLowerCase();
//     const existing = await UserModel.findOne({ email: normalizedEmail });
//     if (existing) return res.status(409).json({ message: "User already exists." });

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password.toString(), salt);

//     const user = await UserModel.create({
//       username: (username || "").toString().trim(),
//       email: normalizedEmail,
//       password: hash,
//     });

//     const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

//     return res.status(201).json({
//       message: "Signup successful",
//       token,
//       user: { id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

//     const normalizedEmail = (email || "").toString().trim().toLowerCase();
//     const user = await UserModel.findOne({ email: normalizedEmail });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     // debug
//     console.log("Login attempt for:", normalizedEmail, "userId:", user._id);

//     const valid = await bcrypt.compare(password.toString(), user.password);
//     if (!valid) return res.status(401).json({ message: "Incorrect password." });

//     const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

//     return res.json({ message: "Login successful", token, user: { id: user._id, username: user.username, email: user.email } });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };



// backend/controllers/authController.js
import jwt from "jsonwebtoken";
import UserModel from "../model/UserModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_for_prod";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // ❌ NO bcrypt here
    const user = await UserModel.create({
      username: username.trim(),
      email: normalizedEmail,
      password, // plain password → model hashes it
    });

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
