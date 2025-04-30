 import React from 'react';
import { RiDeleteBin5Fill } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from '../../redux/slices/cartSlice';

function CartContent({ cart, userId, guestId }) {
  const dispatch = useDispatch();

  // Handle quantity changes in the cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  // Handle removing an item from the cart
  const handleRemoveFromCart = ({ productId, size, color }) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products.length > 0 ? (
        cart.products.map((product, index) => {
          // Determine the image source safely
          const imageUrl = Array.isArray(product.images) && product.images.length > 0
            ? product.images[0]
            : "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

          return (
            <div className="flex items-center justify-between py-4 border-b" key={index}>
              <div className="flex items-start">
                <img
                  src={imageUrl}
                  alt={product.name || "Product image"}
                  className="w-20 h-20 object-cover mr-4 rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
                  }}
                />

                <div>
                  <h3>{product.name}</h3>
                  <p className="text-sm text-gray-500">
                    Size: {product.size} | Color: {product.color}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() =>
                        handleAddToCart(product.productId, -1, product.quantity, product.size, product.color)
                      }
                      className="border rounded px-2 py-1 text-xl font-medium"
                    >
                      -
                    </button>
                    <span className="mx-4">{product.quantity}</span>
                    <button
                      onClick={() =>
                        handleAddToCart(product.productId, 1, product.quantity, product.size, product.color)
                      }
                      className="border rounded px-2 py-1 text-xl font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Price & Remove Button */}
              <div className="flex items-center">
                <p className="mr-4">${product.price?.toLocaleString()}</p>
                <button
                  onClick={() =>
                    handleRemoveFromCart({
                      productId: product.productId,
                      size: product.size,
                      color: product.color
                    })
                  }
                >
                  <RiDeleteBin5Fill className="h-6 w-6 text-red-600" />
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default CartContent;
