const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get a cart by user ID or guest ID
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
};

// POST - Add to Cart
router.post("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await getCart(userId, guestId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        (p) =>
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, size, color, quantity });
      }
    } else {
      cart = await Cart.create({
        user: userId || null,
        guestId: guestId || "guest_" + new Date().getTime(),
        products: [{ productId, size, color, quantity }],
        totalPrice: 0,
      });
    }

    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate("products.productId");
    const finalCart = await calculateTotalAndFormat(populatedCart);
    res.status(200).json(finalCart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - Update Quantity
router.put("/", async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1);
      }

      await cart.save();
      const populatedCart = await Cart.findById(cart._id).populate("products.productId");
      const finalCart = await calculateTotalAndFormat(populatedCart);
      return res.status(200).json(finalCart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE - Remove Item
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const productIndex = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1);
      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate("products.productId");
      const finalCart = await calculateTotalAndFormat(populatedCart);
      return res.status(200).json(finalCart);
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Fetch Cart
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const populatedCart = await Cart.findById(cart._id).populate("products.productId");
    const finalCart = await calculateTotalAndFormat(populatedCart);
    res.status(200).json(finalCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST - Merge Guest Cart
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (!guestCart || guestCart.products.length === 0) {
      return res.status(400).json({ message: "Guest cart is empty or not found" });
    }

    if (!userCart) {
      guestCart.user = req.user._id;
      guestCart.guestId = null;
      await guestCart.save();

      const populatedCart = await Cart.findById(guestCart._id).populate("products.productId");
      return res.status(200).json({ message: "Guest cart assigned to user", cart: await calculateTotalAndFormat(populatedCart) });
    }

    // Merge
    guestCart.products.forEach((guestItem) => {
      const existingIndex = userCart.products.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (existingIndex > -1) {
        userCart.products[existingIndex].quantity += guestItem.quantity;
      } else {
        userCart.products.push(guestItem);
      }
    });

    await userCart.save();
    await Cart.findOneAndDelete({ guestId });

    const populatedCart = await Cart.findById(userCart._id).populate("products.productId");
    return res.status(200).json({ message: "Cart merged", cart: await calculateTotalAndFormat(populatedCart) });

  } catch (error) {
    console.error("Merge cart error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ Helper: format and recalculate total
async function calculateTotalAndFormat(cart) {
  let total = 0;

  const products = cart.products.map((item) => {
    const product = item.productId;

    const price = product?.price || 0;
    const quantity = item.quantity || 1;

    total += price * quantity;

    return {
      productId: product._id,
      name: product.name,
      price: price,
      images: product.images,
      quantity: quantity,
      size: item.size,
      color: item.color,
    };
  });

  cart.totalPrice = total;
  await cart.save(); // Save updated total

  return {
    products,
    totalPrice: cart.totalPrice,
    user: cart.user,
    guestId: cart.guestId,
  };
}

module.exports = router;
