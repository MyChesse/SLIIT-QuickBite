import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import promotionRoutes from './routes/promotionRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/promotions', promotionRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'SLIIT QuickBite API' });
});

const PORT = process.env.PORT || 5001;

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

