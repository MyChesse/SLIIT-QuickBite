import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.js";
import { selectCanteen } from "../middleware/SDcanteenMiddleware.js";

import {
  addFoodItem,
  getFoodItems,
  updateStock,
  toggleAvailability,
  deleteFoodItem,
} from "../controllers/SDinventoryController.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

// ====================== PUBLIC ROUTE (NO LOGIN REQUIRED) ======================
router.get("/", getFoodItems); // ← Anyone can see menu items

// ====================== PROTECTED ROUTES (LOGIN REQUIRED) ======================
router.use(protect); // ← All routes below need login

router.post("/", upload.single("image"), selectCanteen, addFoodItem);
router.put("/:id/stock", selectCanteen, updateStock);
router.put("/:id/availability", selectCanteen, toggleAvailability);
router.delete("/:id", selectCanteen, deleteFoodItem);

export default router;
