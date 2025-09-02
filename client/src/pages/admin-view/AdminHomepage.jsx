import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMoneyBillWave, FaShoppingCart, FaBoxOpen, FaTrash } from "react-icons/fa";
import {
  addAdditionalImage,
  fetchAdditionalImages,
  deleteAdditionalImage,
  resetAdditionalState,
} from "../../store/additionalSlice"; // Adjust path if needed
import { fetchAllOrders } from "../../store/orderslice"; // Adjust path
import { fetchNewInProducts } from "../../store/productSlice"; // Adjust path
import { Link } from "react-router-dom";

function AdminHomepage() {
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();

  // Redux selectors
  const { newProducts } = useSelector((state) => state.product);
  const { allOrders, totalsales, totalorders, loading: orderLoading, error: orderError } = useSelector(
    (state) => state.orders
  );
  const { additionalImages, loading, error, success } = useSelector((state) => state.additional);

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchNewInProducts({})); // fetch all products without filters
    dispatch(fetchAdditionalImages());

    return () => {
      dispatch(resetAdditionalState());
    };
  }, [dispatch]);

  // Handlers
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageDelete = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleUpload = async () => {
    if (images.length === 0) return;
    for (const image of images) {
      const formData = new FormData();
      formData.append("image", image.file);
      await dispatch(addAdditionalImage(formData));
    }
    setImages([]);
    dispatch(fetchAdditionalImages());
  };

  const handleDeleteFromServer = (id) => {
    dispatch(deleteAdditionalImage(id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 font-poppins bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-10">Admin Dashboard</h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-14">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl shadow-md p-6 transform hover:scale-[1.02] transition duration-200">
          <FaMoneyBillWave className="text-4xl opacity-80 mb-4" />
          <h2 className="text-lg font-semibold mb-1">Revenue</h2>
          <p className="text-2xl font-medium">₹ {totalsales?.toLocaleString() || 0}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between mb-4">
            <FaShoppingCart className="text-4xl text-blue-600" />
            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">All Time</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Total Orders</h2>
          <p className="text-2xl font-bold text-gray-900 mb-3">{totalorders || 0}</p>
          <Link to="/admin/order" className="text-sm text-blue-600 font-medium hover:underline">
            Manage Orders →
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-lg transition duration-200">
          <div className="flex items-center justify-between mb-4">
            <FaBoxOpen className="text-4xl text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">Total Products</h2>
          <p className="text-2xl font-bold text-gray-900 mb-3">{Array.isArray(newProducts) ? newProducts.length : 0}</p>
          <Link to="/admin/Products" className="text-sm text-green-600 font-medium hover:underline">
            Manage Products →
          </Link>
        </div>
      </div>

      {/* Image Uploader Section */}
      <div className="bg-white border rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Images</h2>

        <label className="cursor-pointer block">
          <div className="border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl p-6 bg-gray-50 flex flex-col items-center justify-center h-64 transition duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4-4a3 3 0 014.24 0L16 16m0 0l4-4m-4 4v4m-8-4H4m16 0a2 2 0 002-2V6a2 2 0 00-2-2h-4l-2-2h-4l-2 2H4a2 2 0 00-2 2v8a2 2 0 002 2h4"
              />
            </svg>
            <p className="text-gray-500 text-sm">Click or drag & drop to upload</p>
          </div>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
        </label>

        <button
          onClick={handleUpload}
          disabled={images.length === 0 || loading}
          className="mt-4 w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 mt-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-lg overflow-hidden shadow hover:shadow-lg transition-all bg-white"
              >
                <img src={img.url} alt="Preview" className="w-full h-40 object-cover" />
                <button
                  onClick={() => handleImageDelete(img.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Uploaded Images from server */}
        {additionalImages && additionalImages.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-10 mb-4">Uploaded Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {additionalImages.map((img) => (
                <div key={img._id} className="relative rounded-lg overflow-hidden shadow bg-white">
                  <img src={img.images} alt="Uploaded" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => handleDeleteFromServer(img._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-100 hover:opacity-90 transition-opacity"
                    title="Delete from server"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Show error if any */}
        {error && (
          <p className="mt-4 text-red-600 font-medium">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminHomepage;
