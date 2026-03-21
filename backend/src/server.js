import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import SDinventoryRoutes from './routes/SDinventoryRoutes.js';
import SDcanteenRoutes from './routes/SDcanteenRoutes.js';

dotenv.config();

const app = express();

// ✅ IMPORTANT: CORS must come BEFORE routes
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-canteen-id"]
  })
);

// Handle preflight requests
app.options('*', cors());

// Body parser middleware
app.use(express.json());

// Routes - AFTER CORS
app.use("/api/inventory", SDinventoryRoutes);
app.use("/api/canteens", SDcanteenRoutes);

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("✅ Server is running on Port: ", PORT);
    console.log("📍 CORS enabled for http://localhost:5173");
  });
});