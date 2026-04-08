import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// CREATE ORDER
router.post('/create', async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log the request body

    const { studentName, studentId, items, total, pickupDate, pickupTime } = req.body;

    // Validation
    if (!Array.isArray(items) || items.length === 0) {
      console.error('Validation error: Cart cannot be empty');
      return res.status(400).json({ error: 'Cart cannot be empty' });
    }

    if (!pickupDate) {
      console.error('Validation error: Pickup date is required');
      return res.status(400).json({ error: 'Pickup date is required' });
    }

    if (!pickupTime) {
      console.error('Validation error: Pickup time is required');
      return res.status(400).json({ error: 'Pickup time is required' });
    }

    if (!total || total <= 0) {
      console.error('Validation error: Total must be greater than 0');
      return res.status(400).json({ error: 'Total must be greater than 0' });
    }

    // Create new order
    const newOrder = new Order({
      studentName,
      studentId,
      items,
      total,
      pickupDate,
      pickupTime,
      status: 'Pending'
    });

    await newOrder.save();

    console.log('Order created successfully:', newOrder);
    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET ALL ORDERS
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Optional: GET orders via API route
router.get('/api', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ source: 'API', orders });
  } catch (error) {
    console.error('Error fetching orders via API:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET ORDER BY ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// CANCEL AN ORDER
router.put('/:id/cancel', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow cancelling if not already completed or cancelled
    if (order.status === 'Completed' || order.status === 'Cancelled') {
      return res.status(400).json({ message: `Cannot cancel an order that is ${order.status}` });
    }

    order.status = 'Cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
});

export default router;
