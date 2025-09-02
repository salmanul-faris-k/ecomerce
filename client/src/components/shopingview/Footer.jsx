import React, { useState } from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeNewsletter, resetNewsletterStatus, resetNewsletterError } from '../../store/newsletterSlice'; // adjust path
import { toast } from 'sonner';

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);
const [email, setEmail] = useState('');

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleScrollTop = () => window.scrollTo(0, 0);
const dispatch = useDispatch();
const { loading, status, error } = useSelector((state) => state.newsletter);
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
    <footer className="bg-[#f2eded] text-black text-sm border-t w-full mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Desktop view */}
        <div className="hidden md:grid grid-cols-4 gap-10">
          <div>
            <h3 className="font-semibold mb-5">INFO</h3>
            <ul className="space-y-4">
              <li><Link to="/Faq" onClick={handleScrollTop}>FAQ</Link></li>

              <li><Link to="/PrivacyPolicy" onClick={handleScrollTop}>Privacy Policy</Link></li>

              <li><Link to="/TermsAndConditions" onClick={handleScrollTop}>Terms of Service</Link></li>

              <li><Link to="/StoreAndContact" onClick={handleScrollTop}>Reach Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-5">REACH US</h3>
            <p className="mb-3">Mon - Sat | 9:00 AM - 6:00 PM (IST)</p>
            {/* <p className="mb-3">+91 9567760206</p>
            <p className="mb-3">+91 88933804142</p> */}
          </div>
          <div>
            <h3 className="font-semibold mb-5">ABOUT US</h3>
            <p className="mb-5 leading-relaxed">
              At Grazie Boutique, we believe fashion should be stylish, comfortable, and accessible without compromising on quality. Our collections are designed to bring together creativity, affordability, and sustainability, making it easier for you to look good and feel good.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-5">News & Updates</h3>
            <p className="mb-5">Sign up to get the latest on sales, new releases and more...</p>
          <input
  type="email"
  placeholder="Enter your email address..."
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-4 border border-gray-400 rounded mb-5"
/>

           <button
  onClick={handleSubscribe}
  disabled={loading}
  className="w-full bg-[#1745A2] text-white py-4 uppercase tracking-wide hover:bg-[#1745A2] transition duration-300"
>
  {loading ? 'Signing Up...' : 'Sign Up'}
</button>

          </div>
        </div>

        {/* Mobile accordion view */}
        <div className="md:hidden space-y-6">
          <div>
            <button
              onClick={() => toggleSection('info')}
              className="w-full flex justify-between items-center py-4 border-b border-gray-400 font-semibold"
            >
              INFO
              <span>{openSection === 'info' ? '-' : '+'}</span>
            </button>
            <AnimatePresence>
              {openSection === 'info' && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden space-y-3 mt-3 pl-2"
                >
                <li><Link to="/Faq" onClick={handleScrollTop}>FAQ</Link></li>

              <li><Link to="/PrivacyPolicy" onClick={handleScrollTop}>Privacy Policy</Link></li>

              <li><Link to="/TermsAndConditions" onClick={handleScrollTop}>Terms of Service</Link></li>

              <li><Link to="/StoreAndContact" onClick={handleScrollTop}>Reach Us</Link></li>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          <div>
            <button
              onClick={() => toggleSection('reach')}
              className="w-full flex justify-between items-center py-4 border-b border-gray-400 font-semibold"
            >
              REACH US
              <span>{openSection === 'reach' ? '-' : '+'}</span>
            </button>
            <AnimatePresence>
              {openSection === 'reach' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden mt-3 pl-2"
                >
                  <p className="mb-3">Mon - Sat | 9:00 AM - 6:00 PM (IST)</p>
                  {/* <p className="mb-3">+91 9567760206</p>
                  <p className="mb-3">+91 88933804142</p> */}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <button
              onClick={() => toggleSection('about')}
              className="w-full flex justify-between items-center py-4 border-b border-gray-400 font-semibold"
            >
              ABOUT US
              <span>{openSection === 'about' ? '-' : '+'}</span>
            </button>
            <AnimatePresence>
              {openSection === 'about' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden mt-3 pl-2"
                >
                  <p className="mb-3">
                   At Grazie Boutique, we believe fashion should be stylish, comfortable, and accessible without compromising on quality. Our collections are designed to bring together creativity, affordability, and sustainability, making it easier for you to look good and feel good.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="pt-6">
            <h3 className="font-semibold mb-3">News & Updates</h3>
            <p className="mb-5">Sign up to get the latest on sales, new releases and more...</p>
           <input
  type="email"
  placeholder="Enter your email address..."
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full p-4 border border-gray-400 rounded mb-5"
/>

           <button
  onClick={handleSubscribe}
  disabled={loading}
  className="w-full bg-[#1745A2] text-white py-4 uppercase tracking-wide hover:bg-[#1745A2] transition duration-300"
>
  {loading ? 'Signing Up...' : 'Sign Up'}
</button>

          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-14 pt-8 border-t border-gray-300 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs">&copy; 2025 GRAZIE</p>
          <div className="flex space-x-5 text-xl">
            <a href="https://www.facebook.com/snithasenny/" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
            <a href="https://www.instagram.com/grazie_couture?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
