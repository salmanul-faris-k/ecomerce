import React, { useEffect, useState } from 'react';
import Orderslist from '../../components/shopingview/Orderslist';
import Addresslist from '../../components/shopingview/Addresslist';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const { user } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

useEffect(() => {
  if (!user) {
    navigate("/login?redirect=/account");
  }
}, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  };

  return (
    <div className="min-h-screen bg-white mt-20">
      <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 transition duration-700 font-mono mt-32">
        My Account
      </h2>

      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleLogout}
            className="text-gray-700 text-base border-b border-gray-700 hover:text-[#1745A2] hover:border-[#6f3333] transition duration-300 pb-1"
          >
            Log out
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel - User Info */}
          {/* Left Panel - User Info (Styled) */}
<div className="w-full md:w-1/3 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center space-y-4">
  {/* Avatar */}
  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] flex items-center justify-center text-gray-600 text-3xl font-semibold">
    {user?.FirstName?.charAt(0).toUpperCase() || 'G'}
  </div>

  {/* Name */}
  <h3 className="text-lg font-semibold text-gray-800">
    {user?.FirstName + " " + user?.Lastname || "Guest User"}
  </h3>

  {/* Email */}
  <div className="w-full text-sm text-gray-600">
    <p className="mb-1">
      <span className="font-medium text-gray-700">Email:</span>{' '}
      {user?.email || 'Not provided'}
    </p>

    {/* Phone */}
    {user?.phone && (
      <p>
        <span className="font-medium text-gray-700">Phone:</span>{' '}
        {user.phone}
      </p>
    )}
  </div>
</div>


          {/* Right Panel - Tabs + Content */}
          <div className="w-full md:flex-1 bg-gray-50 rounded-md shadow p-6 border border-gray-200">
            <div className="flex space-x-4 border-b pb-3 mb-4">
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-1 rounded-md text-sm font-medium transition ${
                  activeTab === 'orders'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setActiveTab('address')}
                className={`px-4 py-1 rounded-md text-sm font-medium transition ${
                  activeTab === 'address'
                    ? 'bg-white shadow text-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Address
              </button>
            </div>
            <div className="animate-fade-in">
              {activeTab === 'orders' ? <Orderslist /> : <Addresslist />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
