import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderDetaiil() {
  const { id } = useParams();
  const [orderDetail, setOrderDetail] = useState(null);

  useEffect(() => {
    const mockOrderDetail = {
      _id: id,
      createdAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "paypal",
      shippingMethod: "Standad",
      shippingAddress: { city: "New Delhi", country: "India" },
      OrderItem: [
        {
          productId: "1",
          name: "Jacket",
          price: "120",
          quantity: 1,
          Image: "https://picsum.photos/150?random=1",
        },
        {
          productId: "2",
          name: "Shirt",
          price: "120",
          quantity: 1,
          Image: "https://picsum.photos/150?random=2",
        },
      ],
    };
    setOrderDetail(mockOrderDetail);
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-4  sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 ">Order Detail</h2>
      {!orderDetail ? (
        <p>No Order Detail Found</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border ">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold "></h3>
              Order ID: #{OrderDetaiil._id}
              <p className="text-gray-600">
                {new Date(orderDetail.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-start sm:items-end mt-4 sm:mt-0 ">
              <span
                className={`${
                  orderDetail.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2 `}
              >
                {orderDetail.isPaid ? "Approved" : "Pending"}
              </span>
              <span
                className={`${
                  orderDetail.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2 `}
              >
                {orderDetail.isDelivered ? "Deliverd" : "Pending "}
              </span>
            </div>
          </div>
          {/* // COUSTOMER , PAYMENT , SHIPPING INFO  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2 ">Payment Info</h4>
              <p>Payment Method: {orderDetail.paymentMethod}</p>
            </div>
            <div className="">
              <h4 className="text-lg font-semibold mb-2 ">Shipping Info</h4>
              <p className="">Payment Method:{orderDetail.shippingMethod}</p>
              <p>Status:{orderDetail.isPaid ? "Paid" : "Unpaid"}</p>
              <p>
                Address:
                {`${orderDetail.shippingAddress.city},${orderDetail.shippingAddress.country}`}
              </p>
            </div>
          </div>
          {/* PRODUCT LIST  */}
          <div className="overflow-x-auto ">
            <h4 className="text-lg font-semibold mb-4">Products </h4>
            <table className="min-w-full text-gray-600 mb-4 ">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-2 px-4 ">Name</th>
                        <th className="py-2 px-4 ">Unity Price</th>
                        <th className="py-2 px-4 ">Quantity</th>
                        <th className="py-2 px-4 ">Total</th>
                    </tr>

                </thead>
                <tbody>
                    {
                        orderDetail.OrderItem.map((item)=>(
                            <tr key={item.productId} className="border-b">
                                <td className="py-2 px-4 flex items-center">
                                    <img 
                                    src = {item.Image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg mr-4 "
                                    />
<Link className="text-blue-500 hover:underline" to={`/product/${item.productId}`}>
{item.name}

</Link>
                                </td>
                            <td className="py-2 px-4 ">${item.price} </td>
                            <td className="py-2 px-4 ">${item.quantity} </td>
                            <td className="py-2 px-4 ">${item.price * item.quantity} </td>

                            </tr>
                        ))
                    }
                </tbody>

            </table>
            </div>
            {/* BACK TO ORDER LINK  */}
            <Link to="my-orders" className="text-blue-500 hover:underline"
            >
                Back to My Orders
            </Link>
        </div>
      )}
    </div>
  );
}

export default OrderDetaiil;
