// components/shopingview/FilterDrawer.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function FilterDrawer({ isOpen, onClose, filterOptions }) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, setFilter] = useState({
    ProductType: [],
    Pattern: [],
    Fabric: [],
    Fit: [],
    sizes: [],
    minPrice: "",
    maxPrice: "",
  });

  // Sync filter state with URL search params
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilter({
      ProductType: params.ProductType ? params.ProductType.split(",") : [],
      Pattern: params.Pattern ? params.Pattern.split(",") : [],
      Fabric: params.Fabric ? params.Fabric.split(",") : [],
      Fit: params.Fit ? params.Fit.split(",") : [],
      sizes: params.sizes ? params.sizes.split(",") : [],
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
    });
  }, [searchParams]);

  // Handle checkbox and text input changes
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;
    let newFilter = { ...filter };

    if (type === "checkbox") {
      if (checked) {
        newFilter[name] = [...(newFilter[name] || []), value];
      } else {
        newFilter[name] = newFilter[name].filter((item) => item !== value);
      }
    } else {
      newFilter[name] = value;
    }
    setFilter(newFilter);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Update URL query params based on current filter
  const updateURLParams = () => {
    const params = new URLSearchParams();
    Object.keys(filter).forEach((key) => {
      if (Array.isArray(filter[key]) && filter[key].length > 0) {
        params.append(key, filter[key].join(","));
      } else if (filter[key] !== undefined && filter[key] !== "") {
        params.append(key, filter[key]);
      }
    });
    setSearchParams(params);
    onClose()
    // Removed the navigate call here to avoid redundant navigation
  };

  // Reset all filters and clear URL params
  const handleReset = () => {
    const resetFilter = {
      ProductType: [],
      Pattern: [],
      Fabric: [],
      Fit: [],
      sizes: [],
      minPrice: "",
      maxPrice: "",
    };
    setFilter(resetFilter);
    setSearchParams(new URLSearchParams());
    navigate(""); // Navigate to base URL without query params
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 z-50 h-full w-4/5 sm:w-96 bg-white shadow-2xl p-6 overflow-y-auto rounded-l-xl"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Filter Products</h2>
        <IoClose
          className="text-2xl cursor-pointer hover:text-gray-600"
          onClick={onClose}
        />
      </div>

      {/* Collections - ProductType */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3 border-b pb-1 text-gray-800">
          Collections
        </h3>
        <div className="space-y-2">
          {filterOptions.ProductType.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 text-sm font-medium text-gray-700"
            >
              <input
                type="checkbox"
                value={type}
                onChange={handleFilterChange}
                name="ProductType"
                checked={filter.ProductType.includes(type)}
                className="accent-black w-4 h-4"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Pattern */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3 border-b pb-1 text-gray-800">
          Pattern
        </h3>
        <div className="space-y-2">
          {filterOptions.Pattern.map((pattern) => (
            <label
              key={pattern}
              className="flex items-center gap-3 text-sm font-medium text-gray-700"
            >
              <input
                type="checkbox"
                value={pattern}
                onChange={handleFilterChange}
                name="Pattern"
                checked={filter.Pattern.includes(pattern)}
                className="accent-black w-4 h-4"
              />
              {pattern}
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3 border-b pb-1 text-gray-800">
          Sizes
        </h3>
        <div className="flex flex-wrap gap-3">
          {filterOptions.sizes.map((size) => (
            <label
              key={size}
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <input
                type="checkbox"
                value={size}
                onChange={handleFilterChange}
                name="sizes"
                checked={filter.sizes.includes(size)}
                className="accent-black w-4 h-4"
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      {/* Fabric */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3 border-b pb-1 text-gray-800">
          Fabric
        </h3>
        <div className="space-y-2">
          {filterOptions.Fabric.map((fabric) => (
            <label
              key={fabric}
              className="flex items-center gap-3 text-sm font-medium text-gray-700"
            >
              <input
                type="checkbox"
                value={fabric}
                onChange={handleFilterChange}
                name="Fabric"
                checked={filter.Fabric.includes(fabric)}
                className="accent-black w-4 h-4"
              />
              {fabric}
            </label>
          ))}
        </div>
      </div>

      {/* Fit */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3 border-b pb-1 text-gray-800">
          Fit
        </h3>
        <div className="space-y-2">
          {filterOptions.Fit.map((fit) => (
            <label
              key={fit}
              className="flex items-center gap-3 text-sm font-medium text-gray-700"
            >
              <input
                type="checkbox"
                value={fit}
                onChange={handleFilterChange}
                name="Fit"
                checked={filter.Fit.includes(fit)}
                className="accent-black w-4 h-4"
              />
              {fit}
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <h3 className="text-base font-semibold mb-3 border-b pb-1 text-gray-800">
          Price
        </h3>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Min ₹"
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            name="minPrice"
            value={filter.minPrice}
            onChange={handlePriceChange}
            autoComplete="off"
          />
          <input
            type="text"
            placeholder="Max ₹"
            className="w-full border border-gray-300 px-3 py-2 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            name="maxPrice"
            value={filter.maxPrice}
            onChange={handlePriceChange}
            autoComplete="off"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-semibold tracking-wide hover:opacity-90 transition duration-200"
          onClick={updateURLParams}
          type="button"
        >
          Show Results
        </button>
        <button
          className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-lg text-sm font-semibold tracking-wide hover:bg-gray-100 transition duration-200"
          onClick={handleReset}
          type="button"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
}
