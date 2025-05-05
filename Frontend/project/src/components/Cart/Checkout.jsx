import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import {
  createCheckOut,
  payCheckout,
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
    paying,
    paymentSuccess,
    paymentError,
    finalizing,
    finalizeSuccess,
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

  // Toast notifications
  useEffect(() => {
    if (success) toast.success("Checkout created!");
    if (error) toast.error(`Checkout failed: ${error}`);
    if (paymentSuccess) toast.success("Payment successful!");
    if (paymentError) toast.error(`Payment failed: ${paymentError}`);
    if (finalizeSuccess) {
      toast.success("Order finalized!");
      navigate("/order-confirmation");
    }
    if (finalizeError) toast.error(`Finalization failed: ${finalizeError}`);
  }, [
    success,
    error,
    paymentSuccess,
    paymentError,
    finalizeSuccess,
    finalizeError,
    navigate,
  ]);

  useEffect(() => {
    if (!cart?.products?.length) navigate("/");
    return () => dispatch(resetCheckoutState());
  }, [cart, navigate, dispatch]);

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

    if (process.env.NODE_ENV === "development") {
      console.log("Checkout Payload:", {
        checkoutItems: transformedCheckoutItems,
        shippingAddress: transformedShipping,
        paymentMethod: "Paypal",
        totalPrice: cart.totalPrice,
      });
    }

    dispatch(
      createCheckOut({
        checkoutItems: transformedCheckoutItems,
        shippingAddress: transformedShipping,
        paymentMethod: "Paypal",
        totalPrice: cart.totalPrice,
      })
    );
  };

  const handlePaymentSuccess = async (details) => {
    if (!checkout?._id) return;
    await dispatch(payCheckout({ checkoutId: checkout._id, paymentDetails: details }));
    await dispatch(finalizeCheckout(checkout._id));
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
              <h3 className="text-lg mb-4">Pay With PayPal</h3>
              <PayPalScriptProvider options={{ "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID }}>
                <PayPalButtons
                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [{ amount: { value: cart.totalPrice.toFixed(2) } }],
                    })
                  }
                  onApprove={async (data, actions) => {
                    const details = await actions.order.capture();
                    handlePaymentSuccess(details);
                  }}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    toast.error("PayPal payment failed.");
                  }}
                  disabled={paying || finalizing}
                />
              </PayPalScriptProvider>
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
