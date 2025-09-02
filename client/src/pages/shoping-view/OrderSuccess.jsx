import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../store/cartSlice";

export default function OrderSuccess() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (!checkout || !checkout._id) {
      navigate("/"); // Redirect to home if checkout is missing
      return;
    }
    dispatch(clearCart());
    localStorage.removeItem("cart");
  }, [checkout, dispatch, navigate]);

  // Prevent UI flicker if redirecting
  if (!checkout || !checkout._id) return null;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 10);
  const formattedDate = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-5 sm:p-8 border border-gray-100">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <FaCheckCircle className="text-green-500 animate-bounce" size={48} />
        </div>

        {/* Header */}
        <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
          Your Payment Was Successful
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-600 mb-1">
          We’ve received your order. It’ll be shipped within{" "}
          <span className="font-medium text-gray-800">5–7 business days</span>.
        </p>
        <p className="text-center text-xs sm:text-sm text-gray-500 mb-6">
          Estimated delivery: <strong>{formattedDate}</strong>
        </p>

        {/* Order Summary */}
        <div className="bg-gray-50 border rounded-xl p-4 sm:p-6 mb-6">
          <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-4 border-b pb-2">
            Order ID:{" "}
            <span className="font-mono text-gray-500">
              {checkout.orderId}
            </span>
          </h3>

          <ul className="divide-y divide-gray-200 max-h-72 overflow-y-auto">
            {checkout?.checkoutItems.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between gap-3 py-4 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="flex gap-4">
                  <img
                    src={item.images[0]}
                    alt={item.productName}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-md object-cover border"
                  />
                  <div className="text-sm">
                    <p className="font-medium text-gray-800 line-clamp-1">
                      {item.productName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Size: <span className="text-gray-700">{item.sizes}</span>{" "}
                      &nbsp;| Qty:{" "}
                      <span className="text-gray-700">{item.quantity}</span>
                    </p>
                  </div>
                </div>
                <div className="text-gray-800 text-sm sm:text-base font-medium self-center whitespace-nowrap">
                  ₹{(item.Price * item.quantity).toLocaleString()}
                </div>
              </li>
            ))}

            <li className="flex justify-between pt-4 text-sm sm:text-base font-semibold text-gray-800 border-t border-gray-200 mt-3">
              <span>Total</span>
              <span className="text-base sm:text-lg font-bold text-gray-900">
                ₹{checkout.totalprice.toLocaleString()}
              </span>
            </li>
          </ul>
        </div>

        {/* Button */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-block bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-full text-sm sm:text-base font-medium transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
