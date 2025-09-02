import React, { useState, useEffect } from "react";

import InfiniteSlider from "../../components/shopingview/FeaturedLook";
import Homecard from "../../components/shopingview/Homecard";

// <-- CHANGE: Import redux hooks and thunk
import { useDispatch, useSelector } from "react-redux";
import { fetchAdditionalImages } from "../../store/additionalSlice"; // Adjust path as needed
import { subscribeNewsletter  } from '../../store/newsletterSlice'; // adjust path
import { toast } from 'sonner';

export default function Home() {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  // <-- CHANGE: Get additional images, loading, and error from redux store
  const { additionalImages, loading, error } = useSelector((state) => state.additional);

  // Use additionalImages.length for slider logic
  const [current, setCurrent] = useState(0);
  const lastIndex = additionalImages.length - 1;

  const nextSlide = () =>
    setCurrent((prev) => (prev === lastIndex ? 0 : prev + 1));

  // <-- CHANGE: Fetch additional images on mount
  useEffect(() => {
    dispatch(fetchAdditionalImages());
  }, [dispatch]);

  // Cycle slider every 5 seconds, reset interval on additionalImages change
  useEffect(() => {
    if (additionalImages.length === 0) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [additionalImages]); // <-- depend on additionalImages to start after loaded
const handleSubscribe = () => {
  if (!email.trim()) {
    toast.error('Please enter your email');
    return;
  }
  dispatch(subscribeNewsletter(email))
    .unwrap()
    .then(() => {
      toast.success('Subscribed successfully!');
      setEmail('');
    })
    .catch((err) => {
      toast.error(err?.message || 'Subscription failed');
    });
};

  return (
    <>
      {/* Image Slider */}
      <div className="relative w-full overflow-hidden mt-10 md:mt-16">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[16/8] lg:aspect-[16/7]">
          {/* <-- CHANGE: Use additionalImages from redux instead of static images */}
          {loading && <p className="text-center text-gray-500">Loading images...</p>}
          {error && <p className="text-center text-red-600">Error loading images: {error}</p>}
          {!loading && !error && additionalImages.length === 0 && (
            <p className="text-center text-gray-500">No images found.</p>
          )}
          {!loading && additionalImages.map((img, idx) => (
            <img
              key={img._id || idx}
              src={`${img.images}?auto=format&fit=crop&w=1920&q=80`} // assuming img.images is the URL
              alt={`Slide ${idx + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
                idx === current ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-3">
          {!loading && additionalImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`rounded-full transition-colors ${
                idx === current ? "bg-white" : "bg-gray-400"
              } w-[6px] h-[6px] md:w-[8px] md:h-[8px]`}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center ">
        <h2 className="text-md md:text-[20px] font-medium tracking-widest text-black uppercase mb-4">
          Smart Shopping Trusted by Millions!
        </h2>
        <p className="text-black max-w-4xl mx-auto mt-4 text-center text-[10px] md:text-[13px]">
          At GRAZIE we believe shopping should be smart, simple, and satisfying.
          Trusted by millions across the country, we offer a curated selection of
          high-quality products that bring value to your everyday life. Experience
          reliability, style, and customer-first service — only at GRAZIE.
        </p>
      </div>

      {/* NEW IN STORE */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center  mt-10">
        <h2 className="text-md font-medium md:text-[20px] tracking-widest text-black uppercase mb-4">
          NEW IN STORE
        </h2>
        <p className="text-black max-w-2xl mx-auto text-[10px] md:text-[13px] mt-10">
          Discover our latest Kurtas, Sarees, and Running Materials — where tradition meets
          everyday elegance. Elevate your wardrobe with styles crafted for comfort, beauty,
          and effortless charm. Find your perfect look for every moment, from everyday ease
          to special occasions.
        </p>
      </div>

      <InfiniteSlider />

      <div className="max-w-4xl mx-auto px-4 py-16 text-center  mt-10">
        <h2 className="text-md font-medium md:text-[20px] tracking-widest text-black uppercase mb-4">
          WE ARE WITH YOUR CHOICE
        </h2>
        <p className="text-black max-w-2xl mx-auto text-[10px] md:text-[13px] mt-10">
          Your style speaks for you — and we listen closely. Share your preferences, your favorite cuts, fabrics, or colors,
          and we’ll help you find dresses that match your description perfectly. Because fashion isn’t just about trends;
          it’s about finding pieces that celebrate who you truly are. We’re here to walk that journey with you, matching
          your choices every step of the way.
        </p>
      </div>

      <Homecard />

      <div className=" py-16 px-4 mt-5">
        <div className="max-w-3xl mx-auto text-center">
          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-serif text-[#2a2a2a] mb-3">
            Let's Stay in Touch
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base font-light mb-6">
            Sign up for updates on new collections, special offers and more.
          </p>

          {/* Form */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
            <input
            value={email}
              type="email"
               onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full sm:w-[300px] px-4 py-2.5 border border-gray-300 rounded-md text-sm font-light focus:outline-none focus:border-black placeholder:text-gray-400"
            />
            <button
              onClick={handleSubscribe}
              type="submit"
              className="bg-black text-white text-sm px-6 py-2.5 rounded-md hover:bg-gray-800 transition-all tracking-wide uppercase"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
