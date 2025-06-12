import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createCheckOut,
  finalizeCheckout,
  resetCheckoutState,
} from "../../redux/slices/checkOutSlice";
import { toast } from "react-toastify";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const {
    checkout,
    loading,
    error,
    success,
    finalizing,
    finalizeError,
  } = useSelector((state) => state.checkout);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    county: "",
    phone: "",
  });

  // Show toast messages
  useEffect(() => {
    if (success) toast.success("Checkout created!");
    if (error) toast.error(`Checkout failed: ${error}`);
    if (finalizeError) toast.error(`Finalization failed: ${finalizeError}`);
  }, [success, error, finalizeError]);

  const handleCreateCheckout = (e) => {
    e.preventDefault();

    const transformedShipping = {
      address: `${shippingAddress.address}, ${shippingAddress.county}`,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode,
      country: "India",
    };

    const transformedCheckoutItems = cart.products.map((item) => ({
      productId: item.productId || item._id,
      name: item.name,
      image:
        item.images?.[0] ||
        "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    }));

    dispatch(
      createCheckOut({
        checkoutItems: transformedCheckoutItems,
        shippingAddress: transformedShipping,
        paymentMethod: "Cash on Delivery",
        totalPrice: cart.totalPrice,
      })
    );
  };

  const handleCashOnDelivery = async () => {
    if (!checkout?._id) return;
  
    try {
      const resultAction = await dispatch(finalizeCheckout(checkout._id));
      const orderId = resultAction.payload; // This should be the order._id returned from backend
  
      if (!orderId) {
        toast.error("Order ID missing in response.");
        return;
      }
  
      dispatch(resetCheckoutState());
      // navigate(`/order-confirmation/${orderId}`);
      navigate(`/order-confirmation/${orderId}`); // ✅ CORRECT

    } catch {
      toast.error("Something went wrong with order finalization.");
    }
  };
  

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Left: Shipping & Payment */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full p-2 border rounded"
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          {["firstName", "lastName", "address", "city", "postalCode", "county", "phone"].map(
            (field) => (
              <div key={field} className="mb-4">
                <label className="block text-gray-700 capitalize">
                  {field.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type={field === "phone" ? "tel" : "text"}
                  required
                  className="w-full p-2 border rounded"
                  value={shippingAddress[field]}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, [field]: e.target.value })
                  }
                />
              </div>
            )
          )}

          {!checkout ? (
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded"
              disabled={loading}
            >
              {loading ? "Processing..." : "Continue to Payment"}
            </button>
          ) : (
            <div className="mt-6">
              <h3 className="text-lg mb-4">Payment Method</h3>
              <button
                type="button"
                className="w-full bg-green-600 text-white py-3 rounded"
                onClick={handleCashOnDelivery}
                disabled={finalizing}
              >
                {finalizing ? "Confirming..." : "Pay with Cash on Delivery"}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Right: Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b">
              <img
                src={
                  product.images?.[0] ||
                  "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                }
                alt={product.name || "Product image"}
                className="w-20 h-20 object-cover mr-4 rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
                }}
              />
              <div>
                <h3 className="text-md">{product.name}</h3>
                <p className="text-gray-500">Size: {product.size}</p>
                <p className="text-gray-500">Color: {product.color}</p>
              </div>
              <p className="text-xl">${product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg mb-4 border-t">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mb-4 border-t pt-4">
          <p>Total</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
//  finale change is thia 