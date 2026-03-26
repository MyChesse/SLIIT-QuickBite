import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import cors from "cors";

import orderRoutes from './routes/orderRoutes.js';

dotenv.config();


const app = express();
app.use(cors());


// Middleware

app.use(express.json());

// Routes
app.use('/orders', orderRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'QuickBite API is running!' });
});

const PORT = process.env.PORT || 5001;

connectDB();

app.listen(PORT, () => {
    console.log("Server is running on Port: ", PORT);
});

