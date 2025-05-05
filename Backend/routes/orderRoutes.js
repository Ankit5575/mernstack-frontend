const express = require("express");
const Order = require("../models/OrderItem");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @route   GET /api/orders/my-orders
 * @desc    Get orders of the currently logged-in user
 * @access  Private
 */
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching user's orders:", error);
    res.status(500).json({ message: "Failed to fetch orders. Please try again later." });
  }
});

/**
 * @route   GET /api/orders/all
 * @desc    Admin: Get all orders
 * @access  Private/Admin
 */
router.get("/all", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    console.error("❌ Error fetching all orders:", error);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Admin can update order status
 * @access  Private/Admin
 */
router.put("/:id/status", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order details by ID (only if belongs to logged-in user)
 * @access  Private
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "username email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized access to order" });
    }

    res.json(order);
  } catch (error) {
    console.error("❌ Error fetching order details:", error);
    res.status(500).json({ message: "Failed to retrieve order" });
  }
});

module.exports = router;
