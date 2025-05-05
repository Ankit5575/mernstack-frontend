const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/OrderItem");
const Checkout = require("../models/Checkout");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * Helper: Check if valid ObjectId
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Helper: Validate checkout items
 */
const validateCheckoutItems = async (items) => {
  for (const item of items) {
    if (!isValidObjectId(item.productId)) {
      return { error: `Invalid product ID: ${item.productId}` };
    }

    const product = await Product.findById(item.productId);
    if (!product) {
      return { error: `Product not found: ${item.productId}` };
    }

    if (product.stock !== undefined && product.stock < item.quantity) {
      return { error: `Insufficient stock for product: ${product.name}` };
    }
  }
  return { success: true };
};

// @route   POST /api/checkout
// @desc    Create a new checkout session
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    // Validate required fields
    if (!Array.isArray(checkoutItems) || !checkoutItems.length) {
      return res.status(400).json({ message: "No items in checkout" });
    }
    if (!shippingAddress || !paymentMethod || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate each item
    const validation = await validateCheckoutItems(checkoutItems);
    if (validation.error) {
      return res.status(400).json({ message: validation.error });
    }

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isFinalized: false,
    });

    res.status(201).json(newCheckout);
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   PUT /api/checkout/:id/pay
// @desc    Mark checkout as paid
// @access  Private
router.put("/:id/pay", protect, async (req, res) => {
  const { paymentStatus, paymentDetails } = req.body;

  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid checkout ID" });
    }

    const checkout = await Checkout.findById(id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (paymentStatus === "completed") {
      checkout.paymentStatus = "completed";
      checkout.paymentDetails = paymentDetails;
      checkout.paidAt = new Date();
      await checkout.save();

      return res.status(200).json({ message: "Payment successful", checkout });
    }

    res.status(400).json({ message: "Invalid payment status" });
  } catch (error) {
    console.error("❌ Error updating payment status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/checkout/:id/finalize
// @desc    Finalize checkout and create order
// @access  Private
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid checkout ID" });
    }

    const checkout = await Checkout.findById(id);
    if (!checkout) return res.status(404).json({ message: "Checkout not found" });

    if (checkout.paymentStatus !== "completed") {
      return res.status(400).json({ message: "Checkout is not paid" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    // Update stock for each product
    for (const item of checkout.checkoutItems) {
      const product = await Product.findById(item.productId);
      if (product && product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Create the order
    const order = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems,
      shippingAddress: checkout.shippingAddress,
      totalPrice: checkout.totalPrice,
      paymentMethod: checkout.paymentMethod,
      isPaid: true,
      paidAt: checkout.paidAt,
      isDelivered: false,
      paymentStatus: "completed",
      paymentDetails: checkout.paymentDetails,
    });

    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();
    await checkout.save();

    // Clear the user's cart
    await Cart.findOneAndDelete({ user: checkout.user });

    res.status(201).json({ message: "Checkout finalized", order });
  } catch (error) {
    console.error("❌ Error finalizing checkout:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
