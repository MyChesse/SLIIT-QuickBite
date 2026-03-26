import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// CREATE ORDER
router.post('/create', async (req, res) => {
  try {
    const { items, total, pickupDate, pickupTime } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart cannot be empty' });
    }

    if (!pickupDate) {
      return res.status(400).json({ error: 'Pickup date is required' });
    }

    if (!pickupTime) {
      return res.status(400).json({ error: 'Pickup time is required' });
    }

    if (!total || total <= 0) {
      return res.status(400).json({ error: 'Total must be greater than 0' });
    }

    const newOrder = new Order({
      items,
      total,
      pickupDate,
      pickupTime
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: newOrder
    });

  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ error: error.message });
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

export default router;
