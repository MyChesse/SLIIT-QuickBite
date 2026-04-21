import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";

const router = express.Router();

const createOrder = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the request body

    const { studentName, studentId, items, total, pickupDate, pickupTime } =
      req.body;

    if (!/^IT\d{8}$/.test(String(studentId || "").toUpperCase())) {
      return res
        .status(400)
        .json({ error: "Student ID must be in format IT12345678" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.error("Validation error: Cart cannot be empty");
      return res.status(400).json({ error: "Cart cannot be empty" });
    }

    if (!pickupDate) {
      console.error("Validation error: Pickup date is required");
      return res.status(400).json({ error: "Pickup date is required" });
    }

    if (!pickupTime) {
      console.error("Validation error: Pickup time is required");
      return res.status(400).json({ error: "Pickup time is required" });
    }

    if (!total || total <= 0) {
      console.error("Validation error: Total must be greater than 0");
      return res.status(400).json({ error: "Total must be greater than 0" });
    }

    const newOrder = new Order({
      studentName,
      studentId,
      items,
      total,
      pickupDate,
      pickupTime,
      status: "Pending",
    });

    await newOrder.save();

    console.log("Order created successfully:", newOrder);
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// CREATE ORDER
router.post("/create", createOrder);
router.post("/", createOrder);

// GET ALL ORDERS
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Accept an order (fallback route for environments without /api/admin endpoints)
router.put("/:id/accept", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be accepted" });
    }

    order.status = "Accepted";
    order.cancelledByAdmin = false;
    order.statusMessage = "Order accepted by kitchen";
    await order.save();

    res.json({ message: "Order accepted successfully", order });
  } catch (error) {
    console.error("Accept order error:", error);
    res.status(500).json({ message: "Server error while accepting order" });
  }
});

// Mark order as ready (fallback route for environments without /api/admin endpoints)
router.put("/:id/ready", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Accepted") {
      return res
        .status(400)
        .json({ message: "Only accepted orders can be marked ready" });
    }

    order.status = "Ready";
    order.cancelledByAdmin = false;
    order.statusMessage = "Order is ready for pickup";
    await order.save();

    res.json({ message: "Order marked as ready", order });
  } catch (error) {
    console.error("Ready order error:", error);
    res.status(500).json({ message: "Server error while updating order" });
  }
});

// Cancel an order (define before GET /:id so paths like "cancel" are never treated as an id)
router.put("/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    const adminCancel = req.body?.adminCancel === true;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.status === "Completed" ||
      order.status === "Cancelled" ||
      order.status === "Ready"
    ) {
      return res
        .status(400)
        .json({ message: `Cannot cancel an order that is ${order.status}` });
    }

    order.status = "Cancelled";
    order.cancelledByAdmin = adminCancel;
    order.statusMessage = adminCancel
      ? "Kitchen rejected the order"
      : "Order cancelled by user";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error while cancelling order" });
  }
});

// Complete an order after it is ready
router.put("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Ready") {
      return res
        .status(400)
        .json({ message: "Only ready orders can be completed" });
    }

    order.status = "Completed";
    order.completedAt = new Date();
    await order.save();

    res.json({ message: "Order completed successfully", order });
  } catch (error) {
    console.error("Complete order error:", error);
    res.status(500).json({ message: "Server error while completing order" });
  }
});

// GET ORDER BY ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid order id" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ error: error.message });
  }
});
export default router;
