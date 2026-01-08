


// backend/index.js
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

// route imports
import authRoutes from "./routes/authRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import learningRoutes from "./routes/learningRoutes.js";

// models (used by some routes)
import { HoldingsModel } from "./model/HoldingsModel.js";
import { PositionsModel } from "./model/PositionsModel.js";
import { OrdersModel } from "./model/OrdersModel.js";
import UserModel from "./model/UserModel.js";

// middleware (ensure filename is authmiddleware.js on disk)
import { authMiddleware } from "./middleware/authmiddleware.js";

dotenv.config();

const app = express();

// --------------------
// Config / Middleware
// --------------------
app.use(
  cors({
    origin: [
      "http://localhost:3000", // dashboard
      "http://localhost:3001", // other frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());

// --------------------
// Mount public routes
// --------------------
// Centralized auth routes (signup / login)
app.use("/api/auth", authRoutes);

// Learning routes can be public (or move behind authMiddleware if desired)
app.use("/api/learning", learningRoutes);

// Public quick-check routes
app.get("/", (req, res) => res.json({ ok: true, message: "Backend is running" }));
app.get("/test", (req, res) => res.send("✅ /test route working!"));

// Public: holdings & positions (these are read-only lists)
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    return res.json(allHoldings);
  } catch (err) {
    console.error("Error fetching holdings:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    return res.json(allPositions);
  } catch (err) {
    console.error("Error fetching positions:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------
// Protect trade routes with authMiddleware
// --------------------
// All endpoints in tradeRoutes will require a valid JWT
app.use("/api/trade", authMiddleware, tradeRoutes);
console.log("Protected /api/trade with authMiddleware");

// --------------------
// Orders endpoint (BUY / SELL) — require authentication
// --------------------
// app.post("/newOrder", authMiddleware, async (req, res) => {
//   try {
//     const { name, qty: rawQty, price: rawPrice, mode, username } = req.body;

//     // basic validation
//     if (!name || !rawQty || !rawPrice || !mode || !username) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const qty = Number(rawQty);
//     const price = Number(rawPrice);
//     if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) {
//       return res.status(400).json({ error: "Invalid qty or price" });
//     }

//     console.log("🟢 Received order:", { name, qty, price, mode, username, by: req.user?.email || req.user?.username });

//     // find the user
//     const user = await UserModel.findOne({ username });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     // create an order record (audit)
//     const newOrder = new OrdersModel({ name, qty, price, mode, username, createdAt: new Date() });
//     await newOrder.save();

//     const computeUserSummary = async (username) => {
//       const userHoldings = await HoldingsModel.find({ username });
//       const totalInvestment = userHoldings.reduce((acc, h) => acc + (Number(h.avg) || 0) * (Number(h.qty) || 0), 0);
//       const currentValue = userHoldings.reduce((acc, h) => acc + (Number(h.price) || 0) * (Number(h.qty) || 0), 0);
//       const equity = (user.balance || 0) + currentValue;
//       const totalPL = currentValue - totalInvestment;
//       return { balance: user.balance, totalInvestment, currentValue, equity, totalPL };
//     };

//     // BUY
//     if (mode === "BUY") {
//       const totalCost = price * qty;
//       if (user.balance < totalCost) return res.status(400).json({ error: "Insufficient balance" });

//       user.balance -= totalCost;
//       let holding = await HoldingsModel.findOne({ username, name });

//       if (holding) {
//         const existingQty = Number(holding.qty || 0);
//         const existingAvg = Number(holding.avg || 0);
//         const newQty = existingQty + qty;
//         const newAvg = newQty > 0 ? (existingAvg * existingQty + price * qty) / newQty : price;
//         holding.qty = newQty;
//         holding.avg = newAvg;
//         holding.price = price;
//         await holding.save();
//       } else {
//         holding = new HoldingsModel({ username, name, qty, avg: price, price, net: "+0", day: "+0" });
//         await holding.save();
//       }

//       await user.save();
//       const userSummary = await computeUserSummary(username);
//       return res.status(201).json({
//         message: "Order processed successfully!",
//         updatedHolding: { _id: holding._id, username: holding.username, name: holding.name, qty: holding.qty, avg: holding.avg, price: holding.price, net: holding.net, day: holding.day },
//         userSummary,
//       });
//     }

//     // SELL
//     if (mode === "SELL") {
//       const holding = await HoldingsModel.findOne({ username, name });
//       if (!holding || Number(holding.qty || 0) <= 0) return res.status(400).json({ error: "Not enough holdings to sell" });

//       const holdingQty = Number(holding.qty || 0);
//       if (qty > holdingQty) return res.status(400).json({ error: "Not enough holdings to sell" });

//       user.balance += price * qty;
//       holding.qty = holdingQty - qty;

//       let updatedHolding = null;
//       if (holding.qty <= 0) {
//         await HoldingsModel.deleteOne({ _id: holding._id });
//         updatedHolding = null;
//       } else {
//         holding.price = price;
//         await holding.save();
//         updatedHolding = { _id: holding._id, username: holding.username, name: holding.name, qty: holding.qty, avg: holding.avg, price: holding.price, net: holding.net, day: holding.day };
//       }

//       await user.save();
//       const userSummary = await computeUserSummary(username);
//       return res.status(200).json({ message: "Sell order processed successfully!", updatedHolding, userSummary });
//     }

//     return res.status(400).json({ error: "Invalid order mode" });
//   } catch (err) {
//     console.error("❌ Error in /newOrder:", err);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });





// Replace current /newOrder route with this block (no auth required)
app.post("/newOrder", async (req, res) => {
  try {
    // allow username provided by client; if missing create a guest id
    let { name, qty: rawQty, price: rawPrice, mode, username: providedUsername } = req.body || {};

    // basic validation
    if (!name || !rawQty || !rawPrice || !mode) {
      return res.status(400).json({ error: "Missing required fields: name, qty, price, mode" });
    }

    const qty = Number(rawQty);
    const price = Number(rawPrice);
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ error: "Invalid qty or price" });
    }

    // normalize username or create guest fallback
    let username = (providedUsername || "").toString().trim();
    if (!username) {
      username = `guest_${Date.now()}`; // non-auth guest
    }

    console.log("Received order:", { name, qty, price, mode, username });

    // load user if exists (optional)
    const user = await UserModel.findOne({ username }).exec();

    // helper to compute a consistent summary from actual holdings in DB (safer)
    const computeUserSummary = async (usernameToCompute) => {
      const userHoldings = await HoldingsModel.find({ username: usernameToCompute }).exec();
      const totalInvestment = userHoldings.reduce((acc, h) => acc + (Number(h.avg) || 0) * (Number(h.qty) || 0), 0);
      const currentValue = userHoldings.reduce((acc, h) => acc + (Number(h.price) || 0) * (Number(h.qty) || 0), 0);
      const equity = (user ? (user.balance || 0) : 0) + currentValue;
      const totalPL = currentValue - totalInvestment;
      return {
        balance: user ? user.balance : 0,
        totalInvestment,
        currentValue,
        equity,
        totalPL,
      };
    };

    // create audit order
    const newOrder = new OrdersModel({ name, qty, price, mode, username, createdAt: new Date() });
    await newOrder.save();

    // BUY branch
    if (mode === "BUY") {
      // if user exists, ensure enough balance; otherwise proceed for guest
      if (user) {
        const totalCost = price * qty;
        if ((user.balance || 0) < totalCost) {
          return res.status(400).json({ error: "Insufficient balance" });
        }
        user.balance -= totalCost;
        await user.save();
      }

      // upsert canonical holding for user+symbol
      let holding = await HoldingsModel.findOne({ username, name }).exec();
      if (holding) {
        const existingQty = Number(holding.qty || 0);
        const existingAvg = Number(holding.avg || 0);
        const newQty = existingQty + qty;
        const newAvg = newQty > 0 ? (existingAvg * existingQty + price * qty) / newQty : price;
        holding.qty = newQty;
        holding.avg = newAvg;
        holding.price = price; // update LTP
        await holding.save();
      } else {
        holding = new HoldingsModel({
          username,
          name,
          qty,
          avg: price,
          price,
          net: "+0",
          day: "+0",
        });
        await holding.save();
      }

      const userSummary = await computeUserSummary(username);

      return res.status(201).json({
        message: "Buy order processed successfully!",
        updatedHolding: {
          _id: holding._id,
          username: holding.username,
          name: holding.name,
          qty: holding.qty,
          avg: holding.avg,
          price: holding.price,
          net: holding.net,
          day: holding.day,
        },
        userSummary,
      });
    }

    // SELL branch
    if (mode === "SELL") {
      // find existing holding
      const holding = await HoldingsModel.findOne({ username, name }).exec();

      if (!holding || Number(holding.qty || 0) <= 0) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }

      const holdingQty = Number(holding.qty || 0);
      if (qty > holdingQty) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }

      // credit user balance only if user exists
      if (user) {
        user.balance = (user.balance || 0) + price * qty;
        await user.save();
      }

      // reduce or delete holding
      holding.qty = holdingQty - qty;

      let updatedHolding = null;
      if (holding.qty <= 0) {
        await HoldingsModel.deleteOne({ _id: holding._id }).exec();
        updatedHolding = null;
      } else {
        holding.price = price; // update LTP
        await holding.save();
        updatedHolding = {
          _id: holding._id,
          username: holding.username,
          name: holding.name,
          qty: holding.qty,
          avg: holding.avg,
          price: holding.price,
          net: holding.net,
          day: holding.day,
        };
      }

      const userSummary = await computeUserSummary(username);

      return res.status(200).json({
        message: "Sell order processed successfully!",
        updatedHolding,
        userSummary,
      });
    }

    // unsupported mode
    return res.status(400).json({ error: "Invalid order mode" });
  } catch (err) {
    console.error("❌ Error in /newOrder:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});




// --------------------
// User summary endpoint (public)
// --------------------
app.get("/user/:username/summary", async (req, res) => {
  try {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ balance: user.balance, equityValue: user.equityValue, totalPL: user.totalPL });
  } catch (err) {
    console.error("❌ Error fetching user summary:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// --------------------
// MongoDB connection and server start
// --------------------
const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL || "mongodb://127.0.0.1:27017/tradenest2";

const safeUri = typeof MONGO_URI === "string" ? MONGO_URI.replace(/(\/\/.*:).*@/, "$1****@") : MONGO_URI;
console.log("Starting backend. Connecting to MongoDB URI:", safeUri);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
