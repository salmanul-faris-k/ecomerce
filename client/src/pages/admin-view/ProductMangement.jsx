import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewInProducts, deleteProduct } from '../../store/productSlice'; // adjust import path

// Confirmation Modal component inside same file for simplicity
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-md p-6 max-w-sm w-full shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductMangement() {
  const dispatch = useDispatch();
  const { newProducts, loading, error } = useSelector((state) => state.product);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchNewInProducts());
  }, [dispatch]);

  const products = Array.isArray(newProducts) ? newProducts : [];

  // Open confirmation modal
  const openDeleteModal = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  // Close confirmation modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (!productToDelete) return;
    dispatch(deleteProduct(productToDelete))
      .unwrap()
      .then(() => {
        dispatch(fetchNewInProducts());  // Refresh list after deletion
        closeDeleteModal();
      })
      .catch(() => {
        alert('Failed to delete product. Please try again.');
        closeDeleteModal();
      });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 font-poppins">
      {/* Header with title + icon button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Products</h1>
        <Link
          to="/admin/Products/addproduct"
          className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 p-2 rounded-full transition duration-200"
          title="Add Product"
        >
          <FaPlus size={16} />
        </Link>
      </div>

      {/* Optional: Loading or error message */}
      {loading && (
        <div className="mb-4 text-indigo-600 font-semibold">Loading products...</div>
      )}
      {error && (
        <div className="mb-4 text-red-600 font-semibold">
          Error: {typeof error === 'string' ? error : JSON.stringify(error)}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-100">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-600 uppercase">
              <th className="px-6 py-4 text-left">Image</th>
              <th className="px-6 py-4 text-left">Product Name</th>
              <th className="px-6 py-4 text-left">Price</th>
              <th className="px-6 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((item) => (
                <tr key={item._id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-14 h-14 rounded-md overflow-hidden border">
                      <img
                        src={item.images?.[0] || 'https://via.placeholder.com/56'}
                        alt={item.productName}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </td>
                 <td className="px-6 py-4 font-medium text-gray-900">
  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
    {item.productName}
    {item.countInStock === 0 && (
      <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">
        Out of Stock
      </span>
    )}
  </div>
</td>

                  <td className="px-6 py-4 text-gray-800 font-semibold">₹{item.Price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        to={`/admin/Products/${item._id}/edit`}
                        className="text-gray-500 hover:text-yellow-500 transition"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(item._id)}
                        className="text-red-500 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-6 text-center text-gray-500 italic">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
    </div>
  );
}

export default ProductMangement;
