import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const calculateEstimatedDelivery = (createdAt) => {
  const orderDate = new Date(createdAt);
  orderDate.setDate(orderDate.getDate() + 10);
  return orderDate.toLocaleDateString();
};

function OrderConfirmationPage() {
  const navigate = useNavigate();

  const { orderDetails } = useSelector((state) => state.orders);

  useEffect(() => {
    // Redirect to home if no order is present (e.g., page refreshed)
    if (!orderDetails) {
      navigate("/");
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) return null;

  return (
    <div className="max-w-4xl mx-auto bg-white px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      <div className="p-6 rounded-lg border shadow-sm">
        {/* Order Summary */}
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <h2 className="text-xl font-semibold">Order ID: {orderDetails._id}</h2>
          <p className="text-gray-500">
            Order Date: {new Date(orderDetails.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Estimated Delivery */}
        <div className="mb-8">
          <p className="text-emerald-700 font-medium">
            Estimated Delivery: {calculateEstimatedDelivery(orderDetails.createdAt)}
          </p>
        </div>

        {/* Order Items */}
        <div className="mb-10">
          {orderDetails.orderItems.map((item) => (
            <div key={item.productId} className="flex items-center mb-4 border-b pb-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />
              <div className="flex justify-between w-full items-center">
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-600">
                    {item.color} | Size: {item.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-md font-medium">${item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payment and Delivery Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
            <p className="text-gray-700">{orderDetails.paymentMethod}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
            <p className="text-gray-700">{orderDetails.shippingAddress.address}</p>
            <p className="text-gray-700">
              {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
  