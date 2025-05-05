import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { toast } from "react-toastify";

function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { orderDetails, loadingOrderDetails, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loadingOrderDetails) return <div className="text-center py-10">Loading order details...</div>;

  if (!orderDetails) return <div className="text-center py-10">Order not found.</div>;

  const { _id, createdAt, isPaid, isDelivered, paymentMethod, shippingAddress, orderItems } = orderDetails;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      <div className="p-4 sm:p-6 rounded-lg border bg-white">
        {/* Order Info */}
        <div className="flex flex-col sm:flex-row justify-between mb-6">
          <div>
            <p className="font-semibold">Order ID: #{_id}</p>
            <p className="text-gray-500">{new Date(createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2">
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {isPaid ? "Paid" : "Unpaid"}
            </span>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${isDelivered ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {isDelivered ? "Delivered" : "Pending Delivery"}
            </span>
          </div>
        </div>

        {/* Payment & Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="font-semibold mb-1">Payment Method</h4>
            <p>{paymentMethod || "N/A"}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Shipping Address</h4>
            <p>
              {shippingAddress?.address}, {shippingAddress?.city}, {shippingAddress?.country}
            </p>
            <p>Postal Code: {shippingAddress?.postalCode}</p>
          </div>
        </div>

        {/* Product List */}
        <div className="overflow-x-auto">
          <h4 className="text-lg font-semibold mb-3">Items</h4>
          <table className="min-w-full text-left text-gray-700 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Product</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Qty</th>
                <th className="py-2 px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderItems?.map((item) => (
                <tr key={item.productId} className="border-t">
                  <td className="flex items-center py-2 px-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded mr-3"
                    />
                    <Link
                      to={`/product/${item.productId}`}
                      className="text-blue-500 hover:underline"
                    >
                      {item.name}
                    </Link>
                  </td>
                  <td className="py-2 px-4">${Number(item.price).toFixed(2)}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back link */}
        <div className="mt-6">
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            ← Back to My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
