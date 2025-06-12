import React from 'react';

function PaypalButton({ onSuccess }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg mb-4">Choose Payment Method</h3>
      <button
        className="w-full bg-blue-600 text-white py-3 rounded"
        onClick={() => onSuccess({ method: "Cash on Delivery" })}
      >
        Pay with Cash on Delivery
      </button>
    </div>
  );
}

export default PaypalButton;
