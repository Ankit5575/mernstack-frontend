import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { toast } from "react-toastify";

const calculateEstimatedDelivery = (createdAt) => {
  const orderDate = new Date(createdAt);
  orderDate.setDate(orderDate.getDate() + 10);
  return orderDate.toLocaleDateString();
};

function OrderConfirmationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    orderDetails,
    loadingOrderDetails,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!id) {
      toast.error("Invalid order ID.");
      navigate("/");
      return;
    }

    dispatch(fetchOrderDetails(id));
  }, [id, dispatch, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      navigate("/");
    }
  }, [error, navigate]);

  if (loadingOrderDetails) {
    return <p className="text-center mt-10">Loading order details...</p>;
  }

  if (!orderDetails) {
    return <p className="text-center mt-10">Order not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      <div className="p-6 rounded-lg border shadow-sm">
        {/* Order Info */}
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
          {orderDetails.orderItems?.length > 0 ? (
            orderDetails.orderItems.map((item, index) => (
              <div key={index} className="flex items-center mb-4 border-b pb-4 gap-4">
                <img
                  src={
                    item.image ||
                    "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                  }
                  alt={item.name || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
                  }}
                />
                <div className="flex justify-between w-full items-start">
                  <div>
                    <h4 className="text-md font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">
                      Color: {item.color} | Size: {item.size}
                    </p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-md font-medium text-right">₹{item.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No items in this order.</p>
          )}
        </div>

        {/* Payment and Shipping Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
            <p className="text-gray-700">{orderDetails.paymentMethod}</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
            <p className="text-gray-700">{orderDetails.shippingAddress?.address}</p>
            <p className="text-gray-700">
              {orderDetails.shippingAddress?.city},{" "}
              {orderDetails.shippingAddress?.country}
            </p>
          </div>
        </div>

        {/* Order Status & Total */}
        <div className="border-t pt-4 text-lg font-semibold flex justify-between">
          <span>Total Amount:</span>
          <span>₹{orderDetails.totalPrice}</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          Status: <span className="capitalize">{orderDetails.status}</span>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
