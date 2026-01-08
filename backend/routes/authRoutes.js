




// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import UserModel from "../model/UserModel.js";

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_for_prod";

// // -----------------------
// // USER LOGIN
// // -----------------------
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password are required." });

//     // find user
//     const user = await UserModel.findOne({ email });
//     if (!user)
//       return res.status(404).json({ message: "User not found." });

//     // check password
//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid)
//       return res.status(401).json({ message: "Incorrect password." });

//     // create token
//     const token = jwt.sign(
//       { id: user._id, username: user.username, email: user.email },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email
//       }
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;






// backend/routes/authRoutes.js
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import UserModel from "../model/UserModel.js";


// // in routes/authRoutes.js (top)
// // import express from "express";
// import { signup, login } from "../controllers/authController.js";
// // const router = express.Router();
// router.post("/signup", signup);
// router.post("/login", login);
// // export default router;


// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_for_prod";

// // -----------------------
// // USER SIGNUP
// // -----------------------
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body || {};

//     if (!username || !email || !password)
//       return res.status(400).json({ message: "Username, email and password are required." });

//     const normalizedEmail = (email || "").toString().trim().toLowerCase();

//     // Check existing
//     const existing = await UserModel.findOne({ email: normalizedEmail });
//     if (existing) return res.status(400).json({ message: "User already exists." });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password.toString(), salt);

//     // Create user
//     const user = await UserModel.create({
//       username: (username || "").toString().trim(),
//       email: normalizedEmail,
//       password: hash,
//     });

//     // create token
//     const token = jwt.sign(
//       { id: user._id, username: user.username, email: user.email },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     // Return consistent shape
//     return res.json({
//       message: "Signup successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// // -----------------------
// // USER LOGIN
// // -----------------------
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!email || !password)
//       return res.status(400).json({ message: "Email and password are required." });

//     const normalizedEmail = (email || "").toString().trim().toLowerCase();

//     // find user
//     const user = await UserModel.findOne({ email: normalizedEmail });
//     if (!user) return res.status(404).json({ message: "User not found." });

//     // debug log (remove or reduce in production)
//     console.log("Login attempt for:", normalizedEmail, "userId:", user._id);

//     // check password (bcrypt)
//     const valid = await bcrypt.compare(password.toString(), user.password);
//     if (!valid) return res.status(401).json({ message: "Incorrect password." });

//     // create token
//     const token = jwt.sign(
//       { id: user._id, username: user.username, email: user.email },
//       JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     return res.json({
//       message: "Login successful",
//       token,
//       user: {
//         id: user._id,
//         username: user.username,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;







// // backend/routes/authRoutes.js
// import express from "express";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import UserModel from "../model/UserModel.js";

// const router = express.Router();
// const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_for_prod";

// // Helper: safe string
// const s = (v) => (v === null || v === undefined ? "" : String(v).trim());

// // -----------------------
// // USER SIGNUP
// // -----------------------
// router.post("/signup", async (req, res) => {
//   try {
//     const { username, email, password } = req.body || {};

//     if (!s(username) || !s(email) || !s(password)) {
//       return res.status(400).json({ message: "Username, email and password are required." });
//     }

//     const normalizedEmail = s(email).toLowerCase();

//     // check existing by email OR username
//     const existing = await UserModel.findOne({
//       $or: [{ email: normalizedEmail }, { username: s(username) }],
//     }).exec();

//     if (existing) {
//       console.warn("Signup attempt for existing user:", normalizedEmail, s(username));
//       return res.status(409).json({ message: "Username or email already taken." });
//     }

//     // hash password
//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(String(password), salt);

//     const user = await UserModel.create({
//       username: s(username),
//       email: normalizedEmail,
//       password: hash,
//     });

//     const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     return res.status(201).json({
//       message: "Signup successful",
//       token,
//       user: { id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     console.error("Signup error:", err);
//     // propagate validation messages if any
//     if (err && err.name === "ValidationError") {
//       const msgs = Object.values(err.errors || {}).map((x) => x.message);
//       return res.status(400).json({ message: msgs.join(", ") });
//     }
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// // -----------------------
// // USER LOGIN
// // -----------------------
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body || {};

//     if (!s(email) || !s(password)) {
//       return res.status(400).json({ message: "Email and password are required." });
//     }

//     const normalizedEmail = s(email).toLowerCase();

//     // find user by email
//     const user = await UserModel.findOne({ email: normalizedEmail }).exec();

//     if (!user) {
//       console.warn("Login: user not found for email:", normalizedEmail);
//       return res.status(404).json({ message: "User not found." });
//     }

//     // compare passwords
//     const valid = await bcrypt.compare(String(password), user.password);
//     if (!valid) {
//       console.warn("Login failed: incorrect password for user:", normalizedEmail);
//       return res.status(401).json({ message: "Incorrect password." });
//     }

//     // build token
//     const token = jwt.sign({ id: user._id, username: user.username, email: user.email }, JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // return consistent shape
//     return res.json({
//       message: "Login successful",
//       token,
//       user: { id: user._id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;





import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
