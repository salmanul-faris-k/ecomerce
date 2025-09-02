import React, { useEffect } from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllOrders, updateOrder, deleteOrder } from '../../store/orderslice';
import { PDFDownloadLink } from '@react-pdf/renderer';
import OrderInvoicePDF from '../../components/shopingview/OrderInvoicePDF';

const statusColors = {
  Processing: 'bg-blue-100 text-blue-700',
  Packing: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-purple-100 text-purple-700',
  Outfordelivery: 'bg-orange-100 text-orange-700',
  Delivered: 'bg-green-100 text-green-700',
};

const adminStatusOptions = ['Processing', 'Packing', 'Shipped', 'Outfordelivery', 'Delivered'];

function OrderManagement() {
  const dispatch = useDispatch();
  const { allOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateOrder({ id, status: newStatus })).unwrap().catch(() => {});
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this order?')) {
      dispatch(deleteOrder(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Order Management</h1>
      <div className="space-y-5">
        {allOrders.map((order) => (
          <div
            key={order._id}
            className="w-full bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md transition-all p-4"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              {/* Left Section */}
              <div className="flex gap-4 flex-1">
                <div className="text-3xl text-indigo-500 pt-1">
                  <FaBoxOpen />
                </div>
                <div className="text-sm text-gray-800">
                  <p className="font-semibold">
                    {order.orderItems
                      ? order.orderItems
                          .map(
                            (item) =>
                              `${item.productName}${item.quantity ? ` x ${item.quantity} ${item.sizes || ''}` : ''}`
                          )
                          .join(', ')
                      : ''}
                  </p>
                  <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap leading-snug">
                    {order.shippingAdress &&
                      `${order.shippingAdress.Name}\n${order.shippingAdress.address},\n${order.shippingAdress.city}, ${order.shippingAdress.state}, ${order.shippingAdress.country}, ${order.shippingAdress.pincode}`}
                  </pre>
                </div>
              </div>

              {/* Center Section */}
              <div className="text-xs text-gray-600 min-w-[180px] space-y-1">
                <p>
                  <span className="font-medium">Items:</span>{' '}
                  {order.orderItems ? order.orderItems.length : 0}
                </p>
                <p>
                  <span className="font-medium">Method:</span> {order.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Payment:</span> {order.paymentStatus}
                </p>
                <p>
                  <span className="font-medium">Shipping:</span> {order.shippingMethod || 'N/A'}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{' '}
                  {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : ''}
                </p>
              </div>

              {/* Right Section */}
              <div className="text-right space-y-2 min-w-[150px]">
                <div className="text-base font-semibold text-gray-900 font-poppins">
                  ₹ {order.totalprice}
                </div>
                <div className="relative">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="block w-full appearance-none border border-gray-300 rounded-md bg-gray-100 text-xs text-gray-800 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    disabled={loading || order.status === 'Delivered'}
                  >
                    {adminStatusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div
                    className={`mt-2 inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      statusColors[order.status] || ''
                    }`}
                  >
                    {order.status}
                  </div>
                </div>

                {/* PDF Button */}
                <PDFDownloadLink
                  document={<OrderInvoicePDF order={order} />}
                  fileName={`Order_${order._id}.pdf`}
                >
                  {({ loading }) => (
                    <button
                      className="mt-1 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs font-semibold shadow w-full"
                      disabled={loading}
                    >
                      {loading ? 'Preparing...' : 'Download PDF'}
                    </button>
                  )}
                </PDFDownloadLink>

                {/* DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(order._id)}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-semibold shadow w-full"
                  disabled={loading || order.status === 'Delivered'}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && allOrders.length === 0 && (
          <div className="text-center text-gray-600 py-12">No orders found.</div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
