import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import promotionRoutes from './routes/promotionRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import feedbackRoutes from './routes/feedbackRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Configure ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
<<<<<<< HEAD

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/promotions', promotionRoutes);

connectDB();

app.listen(PORT, () => {
    console.log("Server is running on Port: ", PORT);
});
=======

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
>>>>>>> nuleka

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/complaints', complaintRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

const startServer = async () => {
  try {
    // Start HTTP server only after DB connection is established.
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
      console.log('MongoDB connected successfully');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
