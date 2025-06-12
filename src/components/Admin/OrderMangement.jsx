import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllOrders,
  updateOrderStatus,
  clearStatusUpdateSuccess,
} from '../../redux/slices/adminOrderSlice';
import { toast } from 'react-toastify';

function OrderManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error, statusUpdateSuccess } = useSelector(
    (state) => state.adminOrders
  );

  // ✅ Admin check and data fetch
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  // ✅ Toast and refetch on success
  useEffect(() => {
    if (statusUpdateSuccess) {
      toast.success('Order status updated successfully');
      dispatch(fetchAllOrders());
      dispatch(clearStatusUpdateSuccess());
    }
  }, [statusUpdateSuccess, dispatch]);

  // ✅ Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
    } catch (err) {
      toast.error(err || 'Failed to update status');
    }
  };

  if (loading) return <p className="text-center py-10 text-gray-500">Loading orders...</p>;
  if (error) return <p className="text-center py-10 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 uppercase text-gray-600 text-xs">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer Email</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Change</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">#{order._id}</td>
                  <td className="px-4 py-3">{order?.user?.email || 'N/A'}</td>
                  <td className="px-4 py-3">₹{order?.totalPrice?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status || 'Processing'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className="bg-white border border-gray-300 text-sm text-gray-800 rounded px-2 py-1"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderManagement;
