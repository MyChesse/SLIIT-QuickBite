import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import promotionRoutes from './routes/promotionRoutes.js';
import dotenv from 'dotenv';
import SDinventoryRoutes from './routes/SDinventoryRoutes.js';
import SDcanteenRoutes from './routes/SDcanteenRoutes.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import promotionRoutes from './routes/promotionRoutes.js';

dotenv.config();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
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
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'SLIIT QuickBite API' });
});

const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/promotions', promotionRoutes);

connectDB();

app.listen(PORT, () => {
    console.log("Server is running on Port: ", PORT);
});

const MAX_PORT_RETRIES = 10;

const startServer = (port, retriesLeft = MAX_PORT_RETRIES) => {
  const server = app.listen(port, () => {
    console.log("Server is running on Port: ", port);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && retriesLeft > 0) {
      const nextPort = Number(port) + 1;
      console.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
      startServer(nextPort, retriesLeft - 1);
      return;
    }

    console.error('Failed to start server:', err.message);
    process.exit(1);
  });
};

connectDB().then(() => {
  startServer(PORT);
});