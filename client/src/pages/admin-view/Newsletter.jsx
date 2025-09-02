import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNewsletterSubscribers,
  deleteNewsletterSubscriber,
  fetchContactMessages,
  deleteContactMessage,
} from "../../store/newsletterSlice";
import { toast } from "sonner";
import { IoClose } from "react-icons/io5"; // Close icon

function Newsletter() {
  const dispatch = useDispatch();
  const { subscribers, contactMessages, loading, error } = useSelector(
    (state) => state.newsletter
  );

  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchNewsletterSubscribers());
    dispatch(fetchContactMessages());
  }, [dispatch]);

  const handleDeleteSubscriber = (id) => {
    if (window.confirm("Are you sure you want to delete this subscriber?")) {
      dispatch(deleteNewsletterSubscriber(id))
        .unwrap()
        .then(() => toast.success("Subscriber deleted"))
        .catch((err) =>
          toast.error(err.message || "Failed to delete subscriber")
        );
    }
  };

  const handleDeleteContact = (id) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      dispatch(deleteContactMessage(id))
        .unwrap()
        .then(() => toast.success("Contact message deleted"))
        .catch((err) =>
          toast.error(err.message || "Failed to delete contact")
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 font-poppins space-y-10">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Newsletter & Contact Management
      </h1>

      {/* Newsletter Table */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-x-auto">
        <h2 className="text-lg font-semibold px-4 sm:px-6 py-4 border-b bg-gray-50">
          Newsletter Subscribers
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-600 uppercase">
                <th className="px-4 sm:px-6 py-4 text-left">Email</th>
                <th className="px-4 sm:px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 sm:px-6 py-4" colSpan="2">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && subscribers.length === 0 && (
                <tr>
                  <td className="px-4 sm:px-6 py-4" colSpan="2">
                    No subscribers found.
                  </td>
                </tr>
              )}
              {subscribers.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4">{item.email}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <button
                      onClick={() => handleDeleteSubscriber(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Table */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-x-auto">
        <h2 className="text-lg font-semibold px-4 sm:px-6 py-4 border-b bg-gray-50">
          Contact Messages
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-600 uppercase">
                <th className="px-4 sm:px-6 py-4 text-left">Name</th>
                <th className="px-4 sm:px-6 py-4 text-left">Email</th>
                <th className="px-4 sm:px-6 py-4 text-left">Message</th>
                <th className="px-4 sm:px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 sm:px-6 py-4" colSpan="4">
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && contactMessages.length === 0 && (
                <tr>
                  <td className="px-4 sm:px-6 py-4" colSpan="4">
                    No contact messages found.
                  </td>
                </tr>
              )}
              {contactMessages.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-4 sm:px-6 py-4">{item.email}</td>
                  <td className="px-4 sm:px-6 py-4 max-w-xs">
                    <span className="line-clamp-1">
                      {item.message || "No message"}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 flex gap-3">
                    <button
                      onClick={() => setSelectedMessage(item)}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteContact(item._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Message Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
            {/* Close Icon */}
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-3 left-3 text-gray-500 hover:text-gray-700"
            >
              <IoClose size={24} />
            </button>

            <div className="p-6 pt-10">
              <h3 className="text-lg font-semibold mb-2">
                Message from {selectedMessage.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Email:</strong> {selectedMessage.email}
              </p>
              <div className="bg-gray-50 p-4 rounded-md text-gray-800 whitespace-pre-wrap break-words max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-4">
          Error: {error.message || error}
        </div>
      )}
    </div>
  );
}

export default Newsletter;
