import express from "express";
import {
  getAllPromotions,
  getPromotionsByCanteen,
  getTodaysPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
} from "../controllers/promotionController.js";

const router = express.Router();

// Get all promotions
router.get("/", getAllPromotions);

// Get today's promotions
router.get("/today", getTodaysPromotions);

// Get promotions by canteen
router.get("/canteen/:canteenName", getPromotionsByCanteen);

// Add a new promotion
router.post("/", addPromotion);

// Update a promotion
router.put("/:id", updatePromotion);

// Delete a promotion
router.delete("/:id", deletePromotion);

export default router;
