import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronDownOutline, IoCloseOutline } from 'react-icons/io5';
import { IoIosMenu } from 'react-icons/io';
import { FiSearch, FiUser } from 'react-icons/fi';
import logo from '../../assets/Group 468.png';
import { PiBag } from 'react-icons/pi';
import { Link, useNavigate } from 'react-router-dom';
import CartDrawer from './CartDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setfilters } from '../../store/productSlice';
import { logout } from '../../store/authSlice';
import { clearCart } from '../../store/cartSlice';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // Cart state
  const [showSearch, setShowSearch] = useState(false); // Search bar overlay state
  const dropdownRef = useRef(null);
  const { cart } = useSelector((state) => state.cart);
  const cartitemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;
  const [Searchdata, setSearchdata] = useState(""); // Search bar overlay state
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!showSearch) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowSearch(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showSearch]);

  const handleScrollTop = () => window.scrollTo(0, 0);
  const handlecontroller = (e) => {
    {
      if (e.key === 'Enter' && Searchdata.trim() !== '') {
        // Dispatch the filters and fetchProducts actions, then navigate
        dispatch(setfilters({ search: Searchdata }));
        dispatch(fetchProducts({ search: Searchdata }));
        navigate(`/Product/?search=${Searchdata}`);
        setSearchdata("")
        setShowSearch(false); 
        handleScrollTop()        // optional: close search overlay after submit
      }
    }
  }
  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
  }
  const { user } = useSelector((state) => state.auth);
const handleAccountClick = () => {
  handleScrollTop()
  if (!user) {
    navigate("/login?redirect=/account");
  } else {
    navigate("/account");
  }
};
  return (
    <header className={`fixed  top-0 w-full z-50 transition-colors bg-[#f2eded] duration-500 ${scrolling ? 'shadow-md' : ''}`}>
      <div className="max-w-7xl mx-auto p-4 relative">

        {/* Mobile Layout */}
        <div className="w-full flex sm:hidden items-center relative">
          <div className="flex items-center space-x-4">
            <button
              aria-label="Toggle menu"
              className="text-2xl"
              onClick={() => {
                setMobileMenuOpen(true);
                setDropdownOpen(false);
              }}
            >
              <IoIosMenu />
            </button>
            <button className="text-xl" aria-label="Search" onClick={() => setShowSearch(true)}>
              <FiSearch />
            </button>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 w-20">
            <Link onClick={handleScrollTop} to="/">
              <img src={logo} alt="logo" className="w-full h-auto object-contain" />
            </Link>
          </div>

          <div className="ml-auto flex items-center">
            <button
              className="text-xl relative"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
            >
              <PiBag />
              {cartitemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] bg-gray-300 text-black flex items-center justify-center rounded-full">
                  {cartitemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="w-28 cursor-pointer">
            <Link onClick={handleScrollTop} to="/">
              <img src={logo} alt="logo" className="w-full h-full object-contain" />
            </Link>
          </div>

          <nav className="flex space-x-6 items-center text-sm font-normal">
            <Link to={'/newin'} onClick={handleScrollTop}
              className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full transition-colors duration-300"
            >
              NEW IN
            </Link>
            <Link to={'/bestseller'} onClick={handleScrollTop}
              className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full transition-colors duration-300"
            >
              BEST SELLERS
            </Link>
            <Link to={'/Product'} onClick={handleScrollTop}
              className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full transition-colors duration-300"
            >
              COLLECTION
            </Link>

         {/* Desktop OUR STORY dropdown */}
<div className="relative cursor-pointer" ref={dropdownRef}>
  <div className="flex items-center space-x-1" onClick={() => setDropdownOpen(!dropdownOpen)}>
    <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 transition-colors duration-300">
      OUR STORY
    </span>
    <motion.svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      initial={false}
      animate={{ rotate: dropdownOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </motion.svg>
  </div>

  {/* Dropdown menu */}
  <AnimatePresence>
    {dropdownOpen && (
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg"
      >
       
         <Link
          to="/aboutus"
          className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-300"
          onClick={() =>{
            handleScrollTop()
             setDropdownOpen(false)}}
        >
                  About Us

        </Link>
        <Link
          to="/StoreAndContact"
          className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-300"
          onClick={() =>{
            handleScrollTop()
             setDropdownOpen(false)}}
        >
          Contact Us
        </Link>
      </motion.div>
    )}
  </AnimatePresence>
</div>

          </nav>

          <div className="flex items-center space-x-6 text-xl text-black">
            <button className="hover:text-gray-600 transition-colors duration-300" aria-label="Search" onClick={() => setShowSearch(true)}>
              <FiSearch />
            </button>
            <button  onClick={handleAccountClick} className="hover:text-gray-600 transition-colors duration-300" aria-label="Account">
              <FiUser />
            </button>
            <button
              className="hover:text-gray-600 transition-colors duration-300 relative"
              aria-label="Cart"
              onClick={() => setCartOpen(true)}
            >
              <PiBag />
              {cartitemCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 text-[10px] bg-gray-300 text-black flex items-center justify-center rounded-full">
                  {cartitemCount}
                </span>
              )}
            </button>
             {user?.role=="admin"&&
                         <Link to={'/admin '}  onClick={handleScrollTop} className='block bg-black text-white px-2  text-sm  rounded'>Admin</Link>
}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => {
                setMobileMenuOpen(false);
                setDropdownOpen(false);
              }}
            />

            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-lg z-50 flex flex-col"
            >
              <div className="flex justify-end p-4">
                <button
                  aria-label="Close menu"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setDropdownOpen(false);
                  }}
                  className="text-2xl hover:text-gray-600 transition-colors duration-300"
                >
                  <IoCloseOutline />
                </button>
              </div>

              <div className="flex-1 p-6 pt-0 space-y-6 text-sm font-normal">
                <button 
                  className="flex items-center space-x-2 text-base font-normal hover:text-gray-600 transition-colors duration-300"
                  onClick={() => {
                    handleAccountClick()
                    setMobileMenuOpen(false)
                  }}
                >
                  <FiUser className="text-lg" />
                  {!user ?
                    <span >Login</span>
                    :
                    <div>
                      <span className='text-sm '>{user.email}</span>

                      <button onClick={handleLogout} className="text-gray-700 text-sm ml-4 hover:text-[#1745A2]
      hover:border-[#6f3333] transition duration-300">
                        (Log out)
                      </button>
                    </div>

                  }

                </button>

                {user?.role=="admin"&&
                <Link to={'/admin'}
                  className="flex items-center space-x-2 text-base font-normal hover:text-gray-600 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Admin</span>
                </Link>}

                <Link to={'/newin'}
                  className="block transition-colors duration-300 hover:text-gray-600"
                  onClick={() => {
                    handleScrollTop()
                    setMobileMenuOpen(false)
                  }}
                >
                  NEW IN
                </Link>
                <Link to={'/bestseller'}
                  className="block transition-colors duration-300 hover:text-gray-600"
                  onClick={() => {
                    handleScrollTop()
                    setMobileMenuOpen(false)
                  }}>BEST SELLERS
                </Link>
                <Link to={'/Product'}
                  className="block transition-colors duration-300 hover:text-gray-600"
                  onClick={() => {
                    handleScrollTop()
                    setMobileMenuOpen(false)
                  }}>
                  COLLECTION
                </Link>

                <div>
                  <button
                    className="w-full text-left flex justify-between items-center transition-colors duration-300 hover:text-gray-600"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    OUR STORY
                    <motion.div
                      initial={false}
                      animate={{ rotate: dropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block"
                    >
                      <IoChevronDownOutline className="text-lg" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="pl-4 mt-2 space-y-2"
                      >
                        <Link to="/aboutus"
                          className="block transition-colors duration-300 hover:text-gray-600"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                                    About Us

                        </Link>
                        <Link to="/StoreAndContact"
                          className="block transition-colors duration-300 hover:text-gray-600"
                          onClick={() => {
                            setDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          Contact Us
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 w-full z-[999] bg-white flex items-center py-2 px-4 shadow"
            style={{ height: 48 }}
          >
            <FiSearch className="text-lg mr-2" />
            <input
              value={Searchdata}
              onChange={(e) => setSearchdata(e.target.value)}
              onKeyDown={(e) => handlecontroller(e)}
              type="text"
              placeholder="Search..."
              autoFocus
              className="flex-1 outline-none bg-transparent"
            />

            <button
              className="ml-2 text-lg"
              aria-label="Close search"
              onClick={() => {
                setSearchdata("")
                setShowSearch(false)
              }}
            >
              <IoCloseOutline />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
