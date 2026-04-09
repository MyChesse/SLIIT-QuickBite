import Canteen from "../models/SDCanteen.js";

// Middleware to extract canteenId from header and validate
export const selectCanteen = async (req, res, next) => {
    const canteenId = req.headers['x-canteen-id'];

    if (!canteenId) {
        return res.status(400).json({ 
            success: false, 
            message: "canteenId is required in header (x-canteen-id)" 
        });
    }

    // Optional: Check if canteen actually exists
    const canteenExists = await Canteen.findById(canteenId);
    if (!canteenExists) {
        return res.status(404).json({ 
            success: false, 
            message: "Canteen not found" 
        });
    }

    req.canteenId = canteenId;   // Attach to request object
    next();
};