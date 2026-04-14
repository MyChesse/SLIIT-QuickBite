import express from 'express';
import {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  trackComplaintByComplaintId,
  updateComplaintStatus,
  replyToComplaint,
  deleteComplaint,
  getComplaintsByEmail
} from '../controllers/complaintController.js';
import { uploadComplaintPhoto } from '../middleware/upload.js';

const router = express.Router();

// POST /api/complaints - Submit new complaint with photo upload
router.post('/', uploadComplaintPhoto, submitComplaint);

// GET /api/complaints - Get all complaints (admin) with optional filters
router.get('/', getAllComplaints);

// GET /api/complaints/email/:email - Get complaints by email (user)
router.get('/email/:email', getComplaintsByEmail);

// GET /api/complaints/track/:complaintId - Track complaint by complaintId (user)
router.get('/track/:complaintId', trackComplaintByComplaintId);

// GET /api/complaints/:id - Get complaint by ID (admin)
router.get('/:id', getComplaintById);

// PUT /api/complaints/:id/status - Update complaint status (admin)
router.put('/:id/status', updateComplaintStatus);

// PUT /api/complaints/:id/reply - Add reply to complaint (admin)
router.put('/:id/reply', replyToComplaint);

// DELETE /api/complaints/:id - Delete complaint (admin)
router.delete('/:id', deleteComplaint);

export default router;
