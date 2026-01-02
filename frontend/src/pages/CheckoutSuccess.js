import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function CheckoutSuccess() {

  useEffect(() => {
    // Clear cart after successful checkout
    localStorage.removeItem("cart");
  }, []);

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md animate-fade-in">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-4 rounded-full">
            <svg
              className="w-14 h-14 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-gray-800">
          Payment Successful!
        </h2>
        <p className="text-gray-600 mt-2">Thank you for your purchase 🎉</p>
        <p className="text-gray-600">Your order has been confirmed.</p>

        <Link
          to="/"
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md font-medium transition active:scale-95"
        >
          Continue Shopping 🛍
        </Link>
      </div>
    </div>
  );
}
