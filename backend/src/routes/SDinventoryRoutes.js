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

router.use(selectCanteen);     

router.post("/", addFoodItem);
router.get("/", getFoodItems);
router.put("/:id/stock", updateStock);           
router.put("/:id/availability", toggleAvailability);  
router.delete("/:id", deleteFoodItem);


export default router;