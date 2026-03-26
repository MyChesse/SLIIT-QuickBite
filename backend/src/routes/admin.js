import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @desc    Get dashboard summary
// @route   GET /api/admin/dashboard-summary
// @access  Private/Admin
router.get('/dashboard-summary', protect, admin, async (req, res) => {
  try {
    // Get user counts by role
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const staffCount = await User.countDocuments({ role: 'staff' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Mock data for other modules (replace with real data when available)
    const summary = {
      totalUsers,
      students: studentCount,
      staff: staffCount,
      admins: adminCount,
      totalOrders: 0, // Placeholder
      totalBookings: 0, // Placeholder
      totalComplaints: 0, // Placeholder
      totalFeedbacks: 0, // Placeholder
      activePromotions: 0 // Placeholder
    };

    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Placeholder endpoints for other modules
router.get('/orders-summary', protect, admin, (req, res) => {
  res.json({ totalOrders: 0, message: 'Orders module not implemented yet' });
});

router.get('/bookings-summary', protect, admin, (req, res) => {
  res.json({ totalBookings: 0, message: 'Bookings module not implemented yet' });
});

router.get('/feedback-summary', protect, admin, (req, res) => {
  res.json({ totalFeedbacks: 0, message: 'Feedback module not implemented yet' });
});

router.get('/complaints-summary', protect, admin, (req, res) => {
  res.json({ totalComplaints: 0, message: 'Complaints module not implemented yet' });
});

router.get('/promotions-summary', protect, admin, (req, res) => {
  res.json({ activePromotions: 0, message: 'Promotions module not implemented yet' });
});

router.get('/inventory-summary', protect, admin, (req, res) => {
  res.json({ totalItems: 0, message: 'Inventory module not implemented yet' });
});

export default router;