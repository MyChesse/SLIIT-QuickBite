import Canteen from "../models/SDCanteen.js";
import User from "../models/User.js";

// Middleware to extract canteenId from header and validate
export const selectCanteen = async (req, res, next) => {
  const canteenId = req.headers["x-canteen-id"];

  if (!canteenId) {
    return res.status(400).json({
      success: false,
      message: "canteenId is required in header (x-canteen-id)",
    });
  }

  // Optional: Check if canteen actually exists
  const canteenExists = await Canteen.findById(canteenId);
  if (!canteenExists) {
    return res.status(404).json({
      success: false,
      message: "Canteen not found",
    });
  }

  if (req.user.role === "admin") {
    req.canteenId = canteenId;
    return next();
  }

  // If user is staff → check assigned canteens
  if (req.user && req.user.role === "staff") {
    const isAssigned = req.user.assignedCanteens.some(
      (id) => id.toString() === canteenId,
    );

    if (!isAssigned) {
      return res.status(403).json({
        message: "You are not authorized to manage this canteen",
      });
    }
  }

  req.canteenId = canteenId;
  next();
};
