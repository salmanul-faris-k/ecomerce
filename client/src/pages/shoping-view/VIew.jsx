import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import InfiniteSliderview from "../../components/shopingview/InfiniteSliderview";
import { fetchProductById,fetchSimilarProducts  } from "../../store/productSlice";
import { addToCart } from "../../store/cartSlice";
import { toast } from "sonner";

export default function View() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { product, similarProducts ,loading, error } = useSelector((state) => state.product);
  const {user,guestId } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeError, setShowSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);
const navigate=useNavigate()
 
  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);
useEffect(() => {
  if (product?._id) {
    dispatch(fetchSimilarProducts(product?._id));
  }
}, [dispatch, product?._id]);
  useEffect(() => {
    if (product?.images?.length) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);
  console.log(product);
useEffect(() => {
  if (product?.countInStock === 0) {
    toast.error("This product is currently out of stock");
    navigate('/')
  }
}, [product]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>Product not found</p>;

  const images = product.images || [];
  const sizesFromProduct = product?.sizes || [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
    } else {
      dispatch(addToCart({
    productId:productId,
    quantity,
    sizes:selectedSize,
    guestId,
    userId:user?._id
  })
).then(()=>{
  setQuantity(1)
  setSelectedSize("")

toast.success("product added to cart")
})
    }
  };
if(loading){
  return <p>loading</p>
}
if(error){
  return <p>error</p>
}
  return (
    <div className="w-full overflow-x-hidden ">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20">
        {/* LEFT SIDE */}
        <div className="flex flex-col items-center lg:items-start w-full">
          <div
            className="aspect-[3/4] w-full max-w-[500px] overflow-hidden cursor-zoom-in hidden md:block"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={selectedImage}
              alt={product?.productName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="hidden md:flex justify-center gap-2 mt-4 w-full max-w-[500px] pb-1 lg:justify-start">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setSelectedImage(img)}
                className="w-24 h-24 lg:w-[118px] lg:h-[130px] object-cover cursor-pointer"
                alt={`Thumb ${idx}`}
              />
            ))}
          </div>

          <div className="w-full md:hidden mt-4">
            <Swiper
              modules={[Pagination]}
              spaceBetween={10}
              slidesPerView={1}
              pagination={{ clickable: true }}
              className="w-full"
            >
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <img
                    src={img}
                    alt={`Slide ${idx}`}
                    onClick={() => {
                      setSelectedImage(img);
                      setIsModalOpen(true);
                    }}
                    className="w-full aspect-[3/4] object-cover cursor-zoom-in"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

                {/* RIGHT SIDE */}
                <div className="self-start">
                    <h1 className="text-lg md:text-xl font-semibold  text-gray-900 mb-2">
                       {product?.productName}
                    </h1>
                    <p className="text-xl text-gray-700 font-poppins mb-4">₹ {product?.Price}</p>

                    {/* Size Selector */}
                  <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Size
            </label>
            <select
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(e.target.value);
                setShowSizeError(false);
              }}
              className={`w-full border px-4 py-2 text-sm rounded-md focus:outline-none ${
                showSizeError ? "border-red-500" : ""
              }`}
            >
              <option value="" disabled hidden>
                Choose a size
              </option>
              {sizesFromProduct?.map((size) => (
                <option key={size}>{size}</option>
              ))}
            </select>
            {showSizeError && (
              <p className="text-sm text-red-500 mt-1">Please select a size</p>
            )}
          </div>

                    {/* Quantity Selector */}
                     <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <div className="flex items-center border w-max rounded">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1 text-xl text-gray-700 hover:text-black"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1) setQuantity(val);
                }}
                className="w-12 text-center border-x outline-none appearance-none 
                           [&::-webkit-inner-spin-button]:appearance-none 
                           [&::-webkit-outer-spin-button]:appearance-none 
                           [-moz-appearance:textfield]"
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-1 text-xl text-gray-700 hover:text-black"
              >
                +
              </button>
            </div>
          </div>

                    {/* Add to Cart */}
                    <div className="mb-6">
                        <button
                            onClick={handleAddToCart}
                            className="w-full py-3 text-sm font-medium text-white bg-[#1745A2] hover:bg-[#1745B1] transition"
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Accordion */}
                   <div className="space-y-6 mt-20 font-poppins">
  <details className="border-b pb-3" >
  <summary className="cursor-pointer text-sm font-medium text-gray-800">
    Product Details
  </summary>
  <div className="text-sm text-gray-700 space-y-2 mt-10">
    <div className="flex justify-between">
      <span className="font-medium text-gray-800">Pattern</span>
      <span>{product?.Pattern}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-800">Pack of</span>
      <span>{product?.Packof}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-800">Fabric</span>
      <span>{product?.Fabric}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-800">Fit</span>
      <span>{product?.Fit}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-800">Package Contents</span>
      <span>{product?.PackageContain}</span>
    </div>
    <div className="flex justify-between">
      <span className="font-medium text-gray-800">Product Type</span>
      <span>{product?.ProductType}</span>
    </div>
  </div>
</details>


  <details className="border-b pb-3">
    <summary className="cursor-pointer text-sm font-medium text-gray-800">
      Description
    </summary>
    <p className="text-sm text-gray-600 mt-2">
    {product?.Description}
    </p>
  </details>

  <details className="border-b pb-3">
    <summary className="cursor-pointer text-sm font-medium text-gray-800">
      Fabric & Wash Care
    </summary>
    <p className="text-sm text-gray-600 mt-2">
      100% Cotton Mulmul. Gentle hand wash separately in cold water.
      Dry in shade.
    </p>
  </details>

  <details className="border-b pb-3">
    <summary className="cursor-pointer text-sm font-medium text-gray-800">
      Manufacturer Details
    </summary>
    <div className="text-xs text-gray-600 mt-2 space-y-2">
      <p><strong>Manufactured & Packed For</strong> - GRAZIE</p>
      <p><strong>Country Of Origin</strong> - India</p>
      <p><strong>For Complaints</strong> - Customer Care No 7827990062, support@byshree.com</p>
      <p><strong>Marketed By</strong> - GRAZIE</p>
      <p><strong>Registered Address</strong> - Elamakkara, Kochi - 682026</p>
    </div>
  </details>

  <details className="border-b pb-3">
    <summary className="cursor-pointer text-sm font-medium text-gray-800">
      Shipping
    </summary>
    <p className="text-sm text-gray-600 mt-2">
      Ships in 3–7 working days.
    </p>
  </details>
  <details className="border-b pb-3">
  <summary className="cursor-pointer text-sm font-medium text-gray-800">
    Order, Refund & Exchange Policy
  </summary>
  <div className="mt-2 space-y-2">
    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
      <li><strong>No cancellations</strong> are accepted once an order has been placed.</li>
      <li><strong>No refunds</strong> will be issued — please review all product details before purchasing.</li>
      <li><strong>Exchange is applicable only</strong> if the product is received in a damaged condition, 
          with an uncut <strong>courier box opening video</strong> provided as proof.</li>
    </ul>
    <p className="text-xs text-gray-500 italic">
      Note: Exchanges will be processed only after verification of the courier box opening video. 
      Claims without valid proof will not be accepted.
    </p>
  </div>
</details>

</div>

                </div>
            </div>

            {/* Modal View */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="relative w-full max-w-5xl p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={selectedImage}
                            alt="Zoomed"
                            className="w-full h-auto object-contain max-h-[90vh]"
                        />
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-white text-3xl"
                        >
                            <IoClose />
                        </button>
                    </div>
                </div>
            )}
            <div className="mt-40">
                <h2 className="text-md text-center font-medium md:text-[20px] tracking-widest text-black uppercase mb-4">
You may also like
  </h2>
<InfiniteSliderview products={similarProducts}/>
            </div>
        </div>
    );
}
