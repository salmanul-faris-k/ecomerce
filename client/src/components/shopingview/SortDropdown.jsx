import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { LuArrowUpDown } from "react-icons/lu";
import { IoCheckmark } from "react-icons/io5";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function SortDropdown({
  isOpen,
  setIsOpen,
  isDesktop,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Map frontend keys to backend sortBy values
  const optionMap = {
    new: "newProduct",
    low: "priceASc",      // Fixed case
    high: "priceDesc",
  };

  const reverseOptionMap = Object.fromEntries(
    Object.entries(optionMap).map(([k, v]) => [v, k])
  );

  const options = [
    { value: "new", label: "New Arrivals" },
    { value: "low", label: "Price: Low to High" },
    { value: "high", label: "Price: High to Low" },
  ];

  const [sortValue, setSortValue] = useState("new");

  // Sync UI with current URL param
  useEffect(() => {
    const currentSort = searchParams.get("sortBy"); // fixed here
    if (currentSort && reverseOptionMap[currentSort]) {
      setSortValue(reverseOptionMap[currentSort]);
    } else {
      setSortValue("new");
    }
  }, [searchParams.toString()]);

  const handleSort = (selected) => {
    setSortValue(selected);
    setIsOpen(false);

    const params = new URLSearchParams(searchParams);
    params.set("sortBy", optionMap[selected]); // fixed here
    setSearchParams(params);
    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium tracking-wide uppercase text-gray-700 hover:text-black transition-all flex items-center gap-1"
      >
        Sort By
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <LuArrowUpDown size={16} />
        </motion.span>
      </button>

      {/* Desktop Dropdown */}
      {isDesktop && isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 shadow-xl z-50 rounded-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSort(opt.value)}
              className={`flex justify-between items-center w-full text-left px-5 py-3 text-sm transition-all duration-150 ${
                sortValue === opt.value
                  ? "font-semibold text-black bg-gray-100"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{opt.label}</span>
              {sortValue === opt.value && (
                <IoCheckmark className="text-green-600" size={18} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      {!isDesktop && (
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/30 z-40"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white p-6 rounded-t-2xl shadow-2xl max-w-md mx-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Sort By
                  </h2>
                  <IoClose
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                    size={26}
                    onClick={() => setIsOpen(false)}
                  />
                </div>
                <div className="space-y-4">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSort(opt.value)}
                      className={`flex justify-between items-center w-full text-left text-base px-1 py-2 rounded transition-all duration-150 ${
                        sortValue === opt.value
                          ? "text-black font-semibold bg-gray-100"
                          : "text-gray-600 hover:text-black hover:bg-gray-50"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortValue === opt.value && (
                        <IoCheckmark className="text-green-600" size={18} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
