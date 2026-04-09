import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";
import SDinventoryRoutes from './routes/SDinventoryRoutes.js';
import SDcanteenRoutes from './routes/SDcanteenRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow same-origin/non-browser requests (like curl/postman) and local dev ports.
    if (!origin) return callback(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-canteen-id"],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json());

// Routes 
app.use("/api/inventory", SDinventoryRoutes);
app.use("/api/canteens", SDcanteenRoutes);
app.use("/api/orders", orderRoutes);
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on Port: ", PORT);
    console.log("CORS enabled for http://localhost:<vite-port>");
  });
});