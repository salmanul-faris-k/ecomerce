import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../store/orderslice"; // Adjust path if needed


const statusColors = {
  Processing: 'bg-blue-300 ',
  Packing: 'bg-yellow-300 ',
  Shipped: 'bg-purple-300',
  Outfordelivery: 'bg-orange-300 ',
  Delivered: 'bg-green-300 ',
}
function OrdersList() {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.orders);

  // Fetch user's orders on mount
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // Use dynamic orders list from redux store (fall back to empty array)
  const orders = Array.isArray(myOrders) ? myOrders : [];

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h3 className="text-lg font-bold mb-4">Order History</h3>

      {/* Optionally, show loading or error */}
      {loading && <div className="text-gray-600 text-sm mb-4">Loading orders...</div>}

      {orders?.length === 0 && !loading ? (
        <div className="text-gray-500 text-xs border p-4 rounded bg-white shadow-sm">
          You haven't placed any orders yet.
        </div>
      ) : (
        <>
          {/* Desktop View */}
          <div className="hidden md:flex flex-col">
            {orders?.map((order) => (
              <div
                key={order._id || order.orderId}
                className="flex items-center bg-white rounded-lg shadow-sm border mb-3 p-3"
              >
                <img
                  src={
                    order.orderItems && order.orderItems[0] && order.orderItems[0].images
                      ? order.orderItems[0].images[0]
                      : "https://via.placeholder.com/56x64?text=No+Image"
                  }
                  alt={order.orderItems && order.orderItems[0] ? order.orderItems[0].productName : "Product"}
                  className="w-14 h-16 object-cover rounded mr-4"
                />
                <div className="flex-1">
                  <div className="font-medium text-base">
                    {order.orderItems
                      ? order.orderItems
                          .map(
                            (item) =>
                              `${item.productName}${
                                item.quantity ? ` x ${item.quantity} ${item.sizes || ""}` : ""
                              }`
                          )
                          .join(", ")
                      : ""}
                  </div>
                  <div className="text-gray-600 text-xs mt-0.5">
                    <span className="mr-2 font-semibold">Qty:</span>
                    {order.orderItems ? order.orderItems.reduce((sum, i) => sum + i.quantity, 0) : 0}
                    <span className="mx-2 font-semibold">Size:</span>
                    {order.orderItems && order.orderItems[0] ? order.orderItems[0].sizes || "N/A" : "N/A"}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">
                    <span className="mr-2">
                      Date: {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "N/A"}
                    </span>
                    <span>Payment: {order.paymentMethod || "N/A"}</span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-right mr-4 w-16">₹ {order.totalprice}</div>

                <div className="flex items-center">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${
                      statusColors[order.status] || "bg-gray-400"
                    }`}
                  ></span>
                  <span className="font-semibold text-xs text-gray-700">{order.status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile/Card View */}
          <div className="md:hidden space-y-3">
            {orders?.map((order) => (
              <div key={order._id || order.orderId} className="bg-white rounded-lg shadow-sm border p-3 flex flex-col">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center">
                    <img
                      src={
                        order.orderItems && order.orderItems[0] && order.orderItems[0].images
                          ? order.orderItems[0].images[0]
                          : "https://via.placeholder.com/56x64?text=No+Image"
                      }
                      alt={order.orderItems && order.orderItems[0] ? order.orderItems[0].productName : "Product"}
                      className="w-14 h-16 object-cover rounded mr-3"
                    />
                    <div>
                      <div className="font-medium text-sm">{order.orderItems ? order.orderItems[0].productName : ""}</div>
                      <div className="text-gray-600 text-xs">
                        Qty: {order.orderItems ? order.orderItems.reduce((sum, i) => sum + i.quantity, 0) : 0} | Size:{" "}
                        {order.orderItems && order.orderItems[0] ? order.orderItems[0].sizes || "N/A" : "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold">₹ {order.totalprice}</div>
                </div>
                <div className="text-gray-400 text-xs mb-1">
                  Date: {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "N/A"} <br />
                  Payment: {order.paymentMethod || "N/A"}
                </div>
                <div className="flex items-center mb-1">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${
                      statusColors[order.status] || "bg-gray-400"
                    }`}
                  ></span>
                  <span className="font-semibold text-xs text-gray-700">{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default OrdersList;
