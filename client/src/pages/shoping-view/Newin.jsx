
import { useDispatch, useSelector } from "react-redux";
import Product from "../../components/shopingview/Product";
import { useEffect } from "react";
import { fetchNewInProducts } from "../../store/productSlice";
import ProductSkeleton from "./ProductSkeleton";
import { PiCoatHanger } from "react-icons/pi";


export default function Newin() {

 const dispatch = useDispatch();
  const { newProducts, loading, error } = useSelector((state) => state.product);
console.log(newProducts);

  useEffect(() => {
    dispatch(fetchNewInProducts());
  }, [dispatch]);


  return (
    <div className="px-4 lg:px-16 py-8 mt-20 font-quattrocento">
       <h2 className="text-md text-center font-medium md:text-[20px] tracking-widest text-black uppercase mb-4">
  NEW IN
  </h2>

      {/* Filter & Sort */}
    

      {/* Product Grid */}
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {loading
  ? Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
  : newProducts?.length > 0
  ?   newProducts.filter(p => p.countInStock > 0).map((product) => (
  <Product key={product._id || product.id} product={product} />
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
