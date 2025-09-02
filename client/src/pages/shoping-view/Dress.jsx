// pages/ProductPage.jsx
import { useState, useEffect, useMemo } from "react";
import { IoFilterSharp } from "react-icons/io5";
import { AnimatePresence } from "framer-motion";
import Product from "../../components/shopingview/Product";
import FilterDrawer from "../../components/shopingview/FilterDrawer";
import SortDropdown from "../../components/shopingview/SortDropdown";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../store/productSlice";
import { PiCoatHanger } from "react-icons/pi";
import ProductSkeleton from "./ProductSkeleton";

export default function ProductPage() {
  const { ProductType } = useParams();
  const [searchParams] = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.product);

  const queryParams = Object.fromEntries([...searchParams]);

  useEffect(() => {
    dispatch(fetchProducts({ ProductType, ...queryParams }));
  }, [dispatch, ProductType, searchParams]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Create unique lists of product filter options (remove duplicates)
  const filterOptions = useMemo(() => {
    const unique = {
      ProductType: new Set(),
      sizes: new Set(),
      Fit: new Set(),
      Pattern: new Set(),
      Fabric: new Set(),
      maxPrice: []
    };

    products.forEach((prod) => {
      if (prod.ProductType) unique.ProductType.add(prod.ProductType);
      if (prod.sizes && Array.isArray(prod.sizes)) {
        prod.sizes.forEach((size) => unique.sizes.add(size));
      }
      if (prod.Fit) unique.Fit.add(prod.Fit);
      if (prod.Pattern) unique.Pattern.add(prod.Pattern);
      if (prod.Fabric) unique.Fabric.add(prod.Fabric);
      if (prod.Price) unique.maxPrice.push(prod.Price);
    });

    return {
      ProductType: Array.from(unique.ProductType),
      sizes: Array.from(unique.sizes),
      Fit: Array.from(unique.Fit),
      Pattern: Array.from(unique.Pattern),
      Fabric: Array.from(unique.Fabric),
      maxPrice: unique.maxPrice.length ? Math.max(...unique.maxPrice) : null,
    };
  }, [products]);
  console.log(products.length,products);


  return (
    <div className="px-4 lg:px-16 py-8 mt-20">
      <h2 className="text-md text-center font-normal md:text-[20px] tracking-widest text-black uppercase mb-4">
        WE ARE WITH YOUR CHOICE
      </h2>

      {/* Filter & Sort */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center gap-1 text-sm font-medium "
        >
          FILTER <IoFilterSharp size={18} />
        </button>

        <SortDropdown isOpen={isSortOpen} setIsOpen={setIsSortOpen} isDesktop={isDesktop} />
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <FilterDrawer
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filterOptions={filterOptions}
          />
        )}
      </AnimatePresence>

      {/* Product Grid */}
     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {loading
  ? Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
  : products?.length > 0
  ? products.map((product) => (
      <Product key={product?._id} loading={loading} error={error} product={product} />
    ))
  : (
    <div className="col-span-full flex flex-col items-center justify-center py-16">
      <PiCoatHanger className="w-24 h-24 mb-4 opacity-70" />
      <p className="text-lg font-semibold text-gray-700 text-center mb-2">
        Sorry! We couldn't find any products.
      </p>
      <p className="text-gray-500 text-center">
        Try one of these categories
      </p>
    </div>
  )}

      </div>

    </div>
  );
}
