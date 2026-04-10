import express from "express";
import {
  submitFeedback,
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
  getFeedbackByEmail,
} from "../controllers/feedbackController.js";

const router = express.Router();

// POST /api/feedback - Submit new feedback
router.post("/", submitFeedback);

// GET /api/feedback - Get all feedback (admin) with optional filters
router.get("/", getAllFeedback);

// GET /api/feedback/:id - Get feedback by ID
router.get("/:id", getFeedbackById);

// GET /api/feedback/email/:email - Get feedback by email (user)
router.get("/email/:email", getFeedbackByEmail);

// DELETE /api/feedback/:id - Delete feedback (admin)
router.delete("/:id", deleteFeedback);

export default router;
