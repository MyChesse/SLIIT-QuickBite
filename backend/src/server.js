import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import SDinventoryRoutes from './routes/SDinventoryRoutes.js';
import SDcanteenRoutes from './routes/SDcanteenRoutes.js';

dotenv.config();

const app = express();


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-canteen-id"]
  })
);


app.options('*', cors());

// Body parser middleware
app.use(express.json());

// Routes 
app.use("/api/inventory", SDinventoryRoutes);
app.use("/api/canteens", SDcanteenRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on Port: ", PORT);
    console.log("CORS enabled for http://localhost:5173");
  });
});