import React from "react";

const checkout = {
  _id: "12345",
  createdAt: new Date(),
  checkoutItems: [
    {
      productId: "1",
      name: "Jacket",
      color: "black",
      size: "M",
      price: 150,
      quantity: 1,
      image: "https://picsum.photos/200/300?random=1",
    },
    {
      productId: "2",
      name: "T-Shirt",
      color: "black",
      size: "M",
      price: 120,
      quantity: 2,
      image: "https://picsum.photos/200/300?random=2",
    },
    //
  ],
  shippingAddress: {
    address: "123 Fashion Street",
    city: "New Delhi",
    country: "INDIA",
  },
};

const calculateEsimatedDelivery = (createdAt) => {
  const orderDate = new Date(createdAt);
  orderDate.setDate(orderDate.getDate() + 10); //ADD 10 DAYS TO THE ORDER DATE
  return orderDate.toLocaleDateString();
};

function OrderConfirmatinPage() {
  return (
    <div className="max-w-4xl mx-auto bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8 ">
        Thany for Your Order!
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border ">
          <div className="flex justify-between mb-20  ">
            {/* ORDER ID AND DATE  */}
            <h2 className="text-xl font-semibold">Order:Id:{checkout._id}</h2>
            <p className="text-gray-500 ">
              Order Date : {new Date(checkout.createdAt).toLocaleDateString()}
            </p>
          </div>
          {/* ESIMATED DELIVERY  */}
          <div>
            <p className="text-emerald-700 text-sm">
              Estimated Delivery:{""}
              {calculateEsimatedDelivery(checkout.createdAt)}
            </p>
          </div>
          <div>
            {/* ORDERR ITEMS  */}
            <div className="mb-20">
              {checkout.checkoutItems.map((item) => (
                <div key={item.productId} className="flex items-center mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md mr-4 "
                  />
                  <div className="">
                    <h4 className="text-md font-semibold">{item.name} </h4>
                    <p className="text-sm text-gray">
                      {item.color} | {item.size}
                    </p>
                    <div className="ml-auto text-right">
                      <p className="text-md">${item.price}</p>
                      <p className="text-sm text-gray-500 ">
                        Qty:{item.quantity}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* // Payment and delivery info// */}
          <div className="grid grid-cols-2 gap-8">
            <div>
                <h4 className="text-lg font-semibold mb-2 ">Payment</h4>
                <p className="text-gray-600">Paypal</p>
                </div>
{/* delivert info  */}
<div>
    <h4 className="text-lg font-semibold mb-2 ">Delivery </h4>
    <p className="text-gray-600">
         {checkout.shippingAddress.address}
    </p>
    <p className="text-gray-600">
 {checkout.shippingAddress.city}
    </p>
    </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderConfirmatinPage;
