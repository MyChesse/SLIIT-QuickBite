import express from "express";
import multer from "multer";
import { 
    addFoodItem, 
    getFoodItems, 
    updateStock, 
    toggleAvailability,
    deleteFoodItem
} from "../controllers/SDinventoryController.js";

import { selectCanteen } from "../middleware/SDcanteenMiddleware.js";

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.use(selectCanteen);     

router.post("/", upload.single("image"), addFoodItem);
router.get("/", getFoodItems);
router.put("/:id/stock", updateStock);           
router.put("/:id/availability", toggleAvailability);  
router.delete("/:id", deleteFoodItem);


export default router;