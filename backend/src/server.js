import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import promotionRoutes from './routes/promotionRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
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

