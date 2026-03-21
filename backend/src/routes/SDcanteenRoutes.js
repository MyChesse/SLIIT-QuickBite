import express from "express";
import Canteen from "../models/SDCanteen.js";

const router = express.Router();

// Get all canteens
router.get("/", async (req, res) => {
    try {
        const canteens = await Canteen.find({ isActive: true });
        res.status(200).json({
            success: true,
            data: canteens
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seed canteens (one-time use)
router.post("/seed", async (req, res) => {
    try {
        await Canteen.deleteMany({});
        const canteens = await Canteen.insertMany([
            { name: "Main Canteen", code: "MAIN", location: "Basement Building", isActive: true },
            { name: "Mini Canteen", code: "MINI", location: "Faculty Area", isActive: true },
            { name: "Hostel Canteen", code: "HOSTEL", location: "Hostel Block", isActive: true }
        ]);
        res.status(201).json({ success: true, data: canteens });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;