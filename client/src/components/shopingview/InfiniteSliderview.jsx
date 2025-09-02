import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { TfiAngleLeft, TfiAngleRight } from "react-icons/tfi";
import { Link } from "react-router-dom";



export default function InfiniteSliderview({ products = [] }) {
  if (!products.length) return null;

  const [sliderRef, instanceRef] = useKeenSlider({
    loop: products.length > 4,
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

  const showArrows = products.length > 4;
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
        {products?.map((item, idx) => (
          <div key={idx} className="keen-slider__slide bg-white group relative cursor-pointer">
           <Link onClick={() =>{
              handleScrollTop()
            }}  to={`/product/${item?._id}`}>
            <div className="aspect-[4/4] w-full overflow-visible relative">
             <img
                  src={item?.images[0]}
                  alt={item?.productName}
                  className="w-full h-full object-cover object-top transition-opacity duration-300 group-hover:opacity-0"
                />

                {/* Hover Image */}
                {item?.images[1] && (
                  <img
                    src={item?.images[1]}
                    alt={`${item?.productName} hover`}
                    className="w-full h-full object-cover object-top absolute top-0 left-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                )}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[150px] bg-white text-black text-center py-2 text-sm font-semibold shadow-md opacity-0 group-hover:opacity-70 transition duration-300">
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
