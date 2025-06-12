import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function MyOrderPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loadingOrders, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        {loadingOrders ? (
          <p className="text-center py-10 text-gray-500">Loading your orders...</p>
        ) : (
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 uppercase text-gray-700">
              <tr>
                <th className="py-2 px-4">Image</th>
                <th className="py-2 px-4">Order ID</th>
                <th className="py-2 px-4">Created</th>
                <th className="py-2 px-4">Shipping</th>
                <th className="py-2 px-4">Items</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Payment</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => handleRowClick(order._id)}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="py-3 px-4">
                      <img
                        src={
                          order.orderItems?.[0]?.image ||
                          "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
                        }
                        alt={order.orderItems?.[0]?.name || "Product"}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";
                        }}
                      />
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium">
                      #{order._id}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {order.shippingAddress
                        ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                        : "N/A"}
                    </td>
                    <td className="py-3 px-4">{order.orderItems?.length}</td>
                    <td className="py-3 px-4">₹{order.totalPrice}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`${
                          order.isPaid
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        } px-2 py-1 rounded-full text-sm`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-yellow-100 text-yellow-700"
                        } px-2 py-1 rounded-full text-sm`}
                      >
                        {order.status || "Processing"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-6 px-4 text-center text-gray-500">
                    You have no orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default MyOrderPage;
