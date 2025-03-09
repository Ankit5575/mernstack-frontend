import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { TbDashboard } from "react-icons/tb";
function MyOrderPage() {
  const [order, setOrder] = useState([]);
const navigate = useNavigate()
  useEffect(() => {
    // SIMULATE FETCING ORDERS
    setTimeout(() => {
      const mockOrders = [
        {
          _id: "12345",
          createdAt: new Date(),
          shippingAddress: { city: "New York", country: "USA" },
          orderItems: [
            {
              name: "prodcut 1",
              images: "https://picsum.photos/200/300?random=1",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
        {
          _id: "34569",
          createdAt: new Date(),
          shippingAddress: { city: "New York", country: "USA" },
          orderItems: [
            {
              name: "prodcut 2",
              images: "https://picsum.photos/200/300?random=2",
            },
          ],
          totalPrice: 100,
          isPaid: true,
        },
      ];
      setOrder(mockOrders);
    }, 1000);
  }, []);
 const handleRowClick = (orderId)=>{
    navigate(`/order/${orderId}`)
 }
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 ">
      <h2 className="text-xl sm:text:2xl font-bold mb-6 ">My Orders</h2>
      <div className="relative shadow-md  sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-us uppercase text-gray-700 ">
            <tr>
              <th className="py-2 px-4 sm:py-3 ">Image </th>
              <th className="py-2 px-4 sm:py-3 ">Order Id </th>
              <th className="py-2 px-4 sm:py-3 "> Created </th>
              <th className="py-2 px-4 sm:py-3 ">Shipping Address </th>
              <th className="py-2 px-4 sm:py-3 ">Items </th>
              <th className="py-2 px-4 sm:py-3 ">price</th>
              <th className="py-2 px-4 sm:py-3 "> Status</th>
            </tr>
          </thead>
          <tbody>
            {order.length > 0 ? (
              order.map((ordar) => (
                <tr
                onClick={()=>handleRowClick(order._id)}
                  key={ordar}
                  className="border-b hover:border-gray-50 cursor-pointer "
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    <img
                      src={ordar.orderItems[0].images}
                      alt={ordar.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg "
                    />
                    You have no order
                  </td>
                  <td className="py-6 px-2 sm:py-4 font-medium text-gray-900 whitespace-nowrap ">
                    #{ordar._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    {new Date(ordar.createdAt).toLocaleDateString()}
                    {new Date(ordar.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    {ordar.shippingAddress
                      ? `${ordar.shippingAddress.city},${ordar.shippingAddress.country}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    {ordar.orderItems.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    {ordar.totalPrice}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    <span
                      className={`${
                        ordar.isPaid
                          ? "bg-green-100 text-green-700 "
                          : "bg-red-100 text-red-700"
                      } px-2 py-1 rounded-full sm:text-sm font-medium`}
                    >
                      {ordar.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-4 px-4 text-center text-gray-500 "
                >
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyOrderPage;
