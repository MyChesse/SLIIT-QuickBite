import express from 'express';
import { protect, admin } from '../middleware/auth.js';
import User from '../models/User.js';
import MenuItem from '../models/SDMenuItem.js';
import Canteen from '../models/SDCanteen.js';

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

    // Get status counts
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });

    // Mock data for other modules (replace with real data when available)
    const summary = {
      totalUsers,
      students: studentCount,
      staff: staffCount,
      admins: adminCount,
      activeUsers,
      suspendedUsers,
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
    const { search, role, status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { _id: search.length === 24 ? search : null }
      ].filter(Boolean);
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalUsers: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
router.get('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create user (admin invite)
// @route   POST /api/admin/users
// @access  Private/Admin
router.post('/users', protect, admin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    if (!['student', 'staff', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      status: 'active'
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role && ['student', 'staff', 'admin'].includes(role)) user.role = role;
    if (status && ['active', 'suspended'].includes(status)) user.status = status;

    await user.save();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
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

router.get('/inventory', protect, admin, async (req, res) => {
  try {
    const {
      search,
      canteenId,
      availability = 'all',
      stock = 'all',
      page = 1,
      limit = 12
    } = req.query;

    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const parsedLimit = Math.max(parseInt(limit, 10) || 12, 1);

    const query = {};

    if (canteenId && canteenId !== 'all') {
      query.canteenId = canteenId;
    }

    if (availability === 'available') {
      query.isAvailable = true;
    } else if (availability === 'unavailable') {
      query.isAvailable = false;
    }

    if (stock === 'out') {
      query.currentStock = 0;
    } else if (stock === 'low') {
      query.$expr = { $lt: ['$currentStock', '$lowStockThreshold'] };
    }

    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    const [items, totalItems, lowStockItems, outOfStockItems, totalStockValue, canteens] = await Promise.all([
      MenuItem.find(query)
        .populate('canteenId', 'name code')
        .sort({ createdAt: -1 })
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit),
      MenuItem.countDocuments(query),
      MenuItem.countDocuments({ $expr: { $lt: ['$currentStock', '$lowStockThreshold'] } }),
      MenuItem.countDocuments({ currentStock: 0 }),
      MenuItem.aggregate([
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: { $multiply: ['$price', '$currentStock'] }
            }
          }
        }
      ]),
      Canteen.find({ isActive: true }).select('name code')
    ]);

    res.json({
      items,
      canteens,
      pagination: {
        currentPage: parsedPage,
        totalPages: Math.ceil(totalItems / parsedLimit),
        totalItems,
        hasNext: parsedPage * parsedLimit < totalItems,
        hasPrev: parsedPage > 1
      },
      summary: {
        totalItems,
        lowStockItems,
        outOfStockItems,
        totalStockValue: totalStockValue[0]?.totalValue || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/inventory-summary', protect, admin, async (req, res) => {
  try {
    const [totalItems, lowStockItems, outOfStockItems, totalStockValue] = await Promise.all([
      MenuItem.countDocuments(),
      MenuItem.countDocuments({ $expr: { $lt: ['$currentStock', '$lowStockThreshold'] } }),
      MenuItem.countDocuments({ currentStock: 0 }),
      MenuItem.aggregate([
        {
          $group: {
            _id: null,
            totalValue: {
              $sum: { $multiply: ['$price', '$currentStock'] }
            }
          }
        }
      ])
    ]);

    res.json({
      totalItems,
      lowStockItems,
      outOfStockItems,
      totalStockValue: totalStockValue[0]?.totalValue || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
