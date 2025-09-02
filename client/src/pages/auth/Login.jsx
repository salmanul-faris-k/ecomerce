import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { loginUser } from '../../store/authSlice';
import { mergeCart } from '../../store/cartSlice';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    login: '',        // <-- Modified from 'email' to 'login' (email or phone)
    Password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("/shop/checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/shop/checkout" : "/");
          
        });
      } else {
        navigate(isCheckoutRedirect ? "/shop/checkout" : "/");
                          toast.success('Login successful!');

      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handlelogin = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(loginUser(loginInfo));

      if (!loginUser.fulfilled.match(resultAction)) {
        toast.error(resultAction.payload?.message || "Incorrect login or password. Please retry.");  // <-- Modified message
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-start md:justify-center min-h-screen px-0 md:px-4">
      <div className="w-full mx-auto max-w-xs sm:max-w-sm md:max-w-md">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 transition duration-700 font-mono">
          Login
        </h2>
        <form onSubmit={handlelogin} className="space-y-6">
          <div>
            <label htmlFor="login" className="block text-start text-md font-bold text-gray-700 mb-2">
              Email or Phone Number    {/* <-- Modified label */}
            </label>
            <input
              id="login"
              type="text"
              value={loginInfo.login}
              onChange={(e) => setLoginInfo({ ...loginInfo, login: e.target.value.trim() })}
              required
              className="w-full h-12 rounded-lg border border-gray-300 px-4 transition duration-300 focus:ring-[#1e81b0] focus:outline-none hover:border-[#1e81b0]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-start text-md font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={loginInfo.Password}
              onChange={(e) => setLoginInfo({ ...loginInfo, Password: e.target.value })}
              onPaste={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              required
              className="w-full h-12 rounded-lg border border-gray-300 px-4 transition duration-300 focus:ring-[#1e81b0] focus:outline-none hover:border-[#1e81b0]"
            />
          </div>

          <div className="flex justify-start text-sm">
            <Link to="/forgot-password" className="text-gray-600 hover:text-[#1745A2] transition duration-300 hover:underline">
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e81b0] text-white font-mono py-3 rounded-none transition transform duration-300 hover:bg-[#1e81b0] hover:scale-105"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center mt-8 text-md">
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-gray-700 border-b border-gray-700 hover:text-[#1745A2] hover:border-[#6f3333] transition duration-300 pb-1"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
