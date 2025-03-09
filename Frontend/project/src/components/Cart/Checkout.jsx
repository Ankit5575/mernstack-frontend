import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    county: "",
    phone: "",
  });
  const [paymentError, setPaymentError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Ensure cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  // const handleCreateCheckout = async (e) => {
  //   e.preventDefault();
  //   setIsProcessing(true);

  //   if (cart && cart.products.length > 0) {
  //     try {
  //       const res = await axios.post(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/checkout/create`,
  //         {
  //           checkoutItems: cart.products,
  //           shippingAddress,
  //           paymentMethod: "Paypal",
  //           totalPrice: cart.totalPrice,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  //           },
  //         }
  //       );

  //       if (res.data && res.data._id) {
  //         setCheckoutId(res.data._id);
  //       }
  //     } catch (error) {
  //       console.error("Checkout creation failed:", error);
  //       setPaymentError("Failed to create checkout. Please try again.");
  //     } finally {
  //       setIsProcessing(false);
  //     }
  //   }
  // };
  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
  
    if (cart && cart.products.length > 0) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/checkout`, // ✅ Updated endpoint
          {
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod: "Paypal",
            totalPrice: cart.totalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
  
        if (res.data && res.data._id) {
          setCheckoutId(res.data._id);
        }
      } catch (error) {
        console.error("Checkout creation failed:", error);
        setPaymentError("Failed to create checkout. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };  
  const handlePaymentSuccess = async (details) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/pay`,
        {
          checkoutId,
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      } else {
        setPaymentError("Payment verification failed. Please contact support.");
      }
    } catch (error) {
      console.error("Payment processing failed:", error);
      setPaymentError("Payment processing failed. Please try again.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.status === 200) {
        navigate("/order-confirmation");
      } else {
        setPaymentError("Failed to finalize checkout. Please contact support.");
      }
    } catch (error) {
      console.error("Checkout finalization failed:", error);
      setPaymentError("Failed to finalize checkout. Please try again.");
    }
  };

  if (cartLoading) return <p>Loading Cart...</p>;
  if (cartError) return <p>Error: {cartError}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                className="w-full p-2 border rounded"
                type="text"
                value={shippingAddress.firstName}
                required
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                className="w-full p-2 border rounded"
                type="text"
                value={shippingAddress.lastName}
                required
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={shippingAddress.address}
              required
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, address: e.target.value })
              }
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                className="w-full p-2 border rounded"
                type="text"
                value={shippingAddress.city}
                required
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                className="w-full p-2 border rounded"
                type="text"
                value={shippingAddress.postalCode}
                required
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">County</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={shippingAddress.county}
              required
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, county: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              className="w-full p-2 border rounded"
              value={shippingAddress.phone}
              required
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, phone: e.target.value })
              }
            />
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Continue to Payment"}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay With PayPal</h3>
                <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID" }}>
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: cart.totalPrice.toFixed(2),
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture();
                      handlePaymentSuccess(details);
                    }}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                      setPaymentError("Payment failed. Please try again.");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )}
          </div>
          {paymentError && <p className="text-red-500 mt-4">{paymentError}</p>}
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover mr-4"
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