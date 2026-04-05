import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Get query params
  const query = new URLSearchParams(location.search);
  const order = query.get("order");
  const reason = query.get("reason");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* ❌ Icon */}
        <div className="text-red-500 text-5xl mb-4">✖</div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-4">
          Your payment was not completed.
        </p>

        {/* Order Info */}
        {order && (
          <p className="text-sm text-gray-500 mb-2">
            Order: <span className="font-semibold">{order}</span>
          </p>
        )}

        {/* Reason */}
        {reason && (
          <p className="text-sm text-red-500 mb-4">
            Reason: {reason}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => navigate("/checkout")}
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Try Again
          </button>

          <button
            onClick={() => navigate("/")}
            className="border border-gray-300 py-2 rounded-lg hover:bg-gray-100"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;