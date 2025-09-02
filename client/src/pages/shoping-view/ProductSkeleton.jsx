function ProductSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Image area with double layered blocks mimicking hover */}
      <div className="relative w-full h-[260px] md:h-[320px] lg:h-[500px] rounded-md overflow-hidden shadow-md bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-md opacity-75"></div>
      </div>
      {/* Product name */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto"></div>
      {/* Product price */}
      <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
    </div>
  );
}
export default ProductSkeleton