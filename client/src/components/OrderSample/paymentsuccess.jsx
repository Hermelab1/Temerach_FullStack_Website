import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderNo = searchParams.get("order");
  const amount = searchParams.get("amt");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border-t-8 border-green-600">

        {/* ✅ Icon */}
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">
          ✓
        </div>

        {/* ✅ Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>

        {/* ✅ Message */}
        <p className="text-gray-600 mb-4">
          Your payment has been successfully processed.
        </p>

        {/* ✅ Order Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-gray-600">
            <strong>Order Number:</strong> {orderNo || "N/A"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Amount Paid:</strong> ${amount || "0.00"}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong>{" "}
            <span className="text-green-600 font-semibold">Paid</span>
          </p>
        </div>

        {/* ✅ Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/home")}
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            View My Orders
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

export default PaymentSuccess;