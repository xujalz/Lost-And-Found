import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import lostRoutes from "./routes/lostRoutes.js";
import foundRoutes from "./routes/foundRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Serve uploads folder
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/lost", lostRoutes);
app.use("/api/found", foundRoutes);

app.get("/", (req, res) => {
  res.send("Lost & Found Backend is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
