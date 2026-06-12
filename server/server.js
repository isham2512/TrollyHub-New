import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import authRoutes    from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stockRoutes   from "./routes/stockRoutes.js";
import orderRoutes   from "./routes/orderRoutes.js";
import reportRoutes  from "./routes/reportRoutes.js";
import userRoutes    from "./routes/userRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

// Trust proxy (needed for Render / reverse proxies)
app.set("trust proxy", 1);

connectDB();

// CORS — allow multiple origins (comma-separated CLIENT_URL)
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, health checks)
    if (!origin) return callback(null, true);
    // Allow listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // Allow any Vercel preview/deployment URL
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (_req, res) => res.json({ message: "Trolly Hub API running ✅" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stock",    stockRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/reports",  reportRoutes);
app.use("/api/users",    userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
