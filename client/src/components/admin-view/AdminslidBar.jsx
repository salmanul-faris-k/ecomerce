import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../../assets/Group 468.png'
import { FaBox } from 'react-icons/fa'
import { RxDashboard } from 'react-icons/rx'
import { MdProductionQuantityLimits } from 'react-icons/md'
import { FiLogOut } from 'react-icons/fi'
import { AiOutlineMail, AiOutlineShopping } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/authSlice'
import { clearCart } from '../../store/cartSlice'

function AdminslidBar() {
   const { user } = useSelector((state) => state.auth);
const navigate=useNavigate()
  const dispatch = useDispatch();
   const handleLogout = () => {
      dispatch(logout());
      dispatch(clearCart());
      navigate('/')
    };
  return (
    <div className="h-full min-h-screen w-64 bg-gradient-to-b from-[#1f1f47] to-[#121223] text-white p-6 shadow-xl">
      {/* Logo */}
      <div className="mb-10 flex justify-center">
        <Link to="/admin" className="block w-36">
          <img
            src={logo}
            alt="Admin Logo"
            className="w-full object-contain drop-shadow-xl"
          />
        </Link>
      </div>

      {/* Title */}
      <h2 className="text-center text-lg font-semibold text-white mb-8 tracking-wide uppercase">
        Admin Dashboard
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-white text-gray-900 shadow-md font-semibold'
                : 'hover:bg-white/10 hover:backdrop-blur-md text-gray-300'
            }`
          }
        >
          <RxDashboard className="text-xl text-cyan-400" />
          <span className="tracking-wide">Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/Products"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-white text-gray-900 shadow-md font-semibold'
                : 'hover:bg-white/10 hover:backdrop-blur-md text-gray-300'
            }`
          }
        >
          <MdProductionQuantityLimits className="text-xl text-yellow-400" />
          <span className="tracking-wide">Products</span>
        </NavLink>

        <NavLink
          to="/admin/order"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-white text-gray-900 shadow-md font-semibold'
                : 'hover:bg-white/10 hover:backdrop-blur-md text-gray-300'
            }`
          }
        >
          <FaBox className="text-xl text-pink-400" />
          <span className="tracking-wide">Orders</span>
        </NavLink>

        {/* Back to Shop button */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-white text-gray-900 shadow-md font-semibold'
                : 'hover:bg-white/10 hover:backdrop-blur-md text-gray-300'
            }`
          }
        >
          <AiOutlineShopping className="text-xl text-green-400" />
          <span className="tracking-wide">Back to Shop</span>
        </NavLink>
<NavLink
            to="/admin/Newsletter"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-white text-gray-900 shadow-md font-semibold'
                  : 'hover:bg-white/10 hover:backdrop-blur-md text-gray-300'
              }`
            }
          >
            <AiOutlineMail className="text-xl text-blue-400" />
            <span className="tracking-wide">Newsletter</span>
          </NavLink>
        {/* Logout button */}
        <button 
          type="button"
          onClick={() => {
            // Add your logout logic here
            handleLogout()
          }}
          className="flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 hover:bg-white/10 hover:backdrop-blur-md text-gray-300"
        >
          <FiLogOut className="text-xl text-red-400" />
          <span className="tracking-wide">Logout</span>
        </button>
      </nav>
    </div>
  )
}

export default AdminslidBar
