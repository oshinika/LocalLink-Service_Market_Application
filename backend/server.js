
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import adminRouter from "./routes/admin.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import profileRouter from "./routes/profile.js";
import { checkJwt } from "./middleware/auth.js";
import roleRoutes from "./routes/roles.js";



dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS for your frontend
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Parse JSON bodies
app.use(express.json());

// Serve uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Use service routes
app.use("/services", serviceRoutes);

// Use admin routes (with JWT check inside routes as needed)
app.use("/api/admin", adminRouter);

app.use("/api/profile", profileRouter);

app.use("/api/roles", roleRoutes);



// Root route for sanity check
app.get("/", (req, res) => {
  res.send("🚀 Backend running");
});

// MongoDB connection


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.error("DB connection error:", err));
