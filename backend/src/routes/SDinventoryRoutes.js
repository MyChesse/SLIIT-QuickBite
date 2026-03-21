import express from "express";
import { 
    addFoodItem, 
    getFoodItems, 
    updateStock, 
    toggleAvailability,
    deleteFoodItem
} from "../controllers/SDinventoryController.js";

import { selectCanteen } from "../middleware/SDcanteenMiddleware.js";

const router = express.Router();

router.use(selectCanteen);     // Applies to all routes below

router.post("/", addFoodItem);
router.get("/", getFoodItems);
router.put("/:id/stock", updateStock);           // ← New
router.put("/:id/availability", toggleAvailability);  // ← New
router.delete("/:id", deleteFoodItem);


export default router;