import React, { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewInProducts } from "../../store/productSlice";
import { Link } from "react-router-dom";


export default function InfiniteSlider() {
   const dispatch = useDispatch();
  const { newProducts, loading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchNewInProducts());
  }, [dispatch]);

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: newProducts.length > 4,
    renderMode: "performance",
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1.2, spacing: 16 },
      },
      "(min-width: 769px) and (max-width: 1024px)": {
        slides: { perView: 3, spacing: 20 },
      },
    },
    slides: { perView: 4, spacing: 24 },
    duration: 300,
  });

  const showArrows = newProducts.length > 4;
  const handleScrollTop = () => window.scrollTo(0, 0);

  return (
    <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
      {showArrows && (
        <>
          <button
            onClick={() => instanceRef.current?.prev()}
            className="hidden md:flex absolute z-10 left-2 lg:left-8 sm:left-4 top-1/2 -translate-y-1/2 bg-white p-2 hover:text-gray-400 rounded-full shadow"
          >
            <TfiAngleLeft size={18} />
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="hidden md:flex absolute z-10 right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-white p-2 hover:text-gray-400 rounded-full shadow"
          >
            <TfiAngleRight size={18} />
          </button>
        </>
      )}

      <div ref={sliderRef} className="keen-slider overflow-visible">
        {newProducts.filter(p => p.countInStock > 0).map((item, idx) => (
          <div key={idx} className="keen-slider__slide bg-white group relative cursor-pointer">
             <Link onClick={() =>{
              handleScrollTop()
            }}
                        to={`/product/${item?._id}`}>
                            <div className="w-full h-[405px] md:h-[520px] overflow-visible relative">
              <img
                 src={item?.images[0]}
                alt={item?.productName}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
              />
               <img
        src={item?.images[1]}
        alt={`${item?.productName} hover`}
        className="w-full h-full object-cover absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[180px] md:w-[200px] bg-white text-black text-center py-2 text-sm font-semibold shadow-md opacity-0 group-hover:opacity-70 transition duration-300">
                SHOP NOW
              </div>
            </div>
                        </Link>
          
            <div className="text-center font-serif mt-3 px-2 pb-5">
              <h3 className="text-base font-medium text-black">{item?.productName}</h3>
              <p className="text-sm font-poppins text-gray-600 mt-2">
               ₹ {item?.Price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
