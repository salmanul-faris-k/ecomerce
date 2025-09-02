import React, { useState } from 'react';
import { toast } from 'sonner';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../store/authSlice';
import { mergeCart } from '../../store/cartSlice';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("/shop/checkout");

  // <-- UPDATED: Added phone in register data state
  const [registerdatainformation, setregisterdatainformation] = useState({
    FirstName: '',
    Lastname: '',
    email: '',
    phone: '',          // <-- Added phone here
    Password: '',
  });

  // <-- UPDATED: Added phone in formErrors state
  const [formErrors, setFormErrors] = useState({
    FirstName: '',
    Lastname: '',
    email: '',
    phone: '',          // <-- Added phone here
    Password: '',
  });

  // 🛠️ Input Validation
  const validateInputs = () => {
    const errors = {
      FirstName: '',
      Lastname: '',
      email: '',
      phone: '',         // <-- Added phone here
      Password: '',
    };

    const { FirstName, Lastname, email, phone, Password } = registerdatainformation;

    if (!FirstName.trim()) errors.FirstName = 'First name is required.';
    if (!Lastname.trim()) errors.Lastname = 'Last name is required.';

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email.trim()) {
  errors.email = 'Email is required.';
} else if (!emailRegex.test(email)) {
  errors.email = 'Please enter a valid email.';
}


const phoneRegex = /^[0-9]{10}$/;
if (!phone.trim()) {
  errors.phone = 'Phone number is required.';  // <-- make phone required
} else if (!phoneRegex.test(phone)) {
  errors.phone = 'Please enter a valid phone number (10 digits).';
}


    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if (!Password.trim()) {
      errors.Password = 'Password is required.';
    } else if (!passwordRegex.test(Password)) {
      errors.Password = 'Min 8 characters, including a number & special character.';
    }

    setFormErrors(errors);
    return Object.values(errors).every((error) => error === '');
  };

  // 🧠 Registration + Merge Logic
  const handleregister = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const resultAction = await dispatch(registerUser(registerdatainformation));

      if (registerUser.fulfilled.match(resultAction)) {
        toast.success('Registration successful!');

        const registeredUser = resultAction.payload?.user;

        // Merge guest cart after registration
        if (cart?.products?.length > 0 && guestId && registeredUser) {
          await dispatch(mergeCart({ guestId, user: registeredUser }));
        }

        navigate(isCheckoutRedirect ? "/shop/checkout" : "/");
      } else {
        toast.error(resultAction.payload?.message || 'This email or phone is already registered. Try logging in.');  // <-- Updated error message
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-start md:justify-center min-h-screen px-0 md:px-4 mt-20">
      <div className="w-full mx-auto max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl">
        <h2 className="text-center text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 transition duration-700 font-mono">
          Create Account
        </h2>

        <form onSubmit={handleregister} className="space-y-3">
          {/* First Name */}
          <div>
            <label className="block text-start text-md font-bold text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              value={registerdatainformation.FirstName}
              onChange={(e) =>
                setregisterdatainformation((prev) => ({ ...prev, FirstName: e.target.value }))
              }
              className="w-full h-12 rounded-lg border border-gray-300 px-4 transition duration-300 focus:ring-[#1e81b0] focus:outline-none hover:border-[#1e81b0]"
            />
            {formErrors.FirstName && <p className="text-red-500 text-sm mt-1">{formErrors.FirstName}</p>}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-start text-md font-bold text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              value={registerdatainformation.Lastname}
              onChange={(e) =>
                setregisterdatainformation((prev) => ({ ...prev, Lastname: e.target.value }))
              }
              className="w-full h-12 rounded-lg border border-gray-300 px-4 transition duration-300 focus:ring-[#1e81b0] focus:outline-none hover:border-[#1e81b0]"
            />
            {formErrors.Lastname && <p className="text-red-500 text-sm mt-1">{formErrors.Lastname}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-start text-md font-bold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={registerdatainformation.email}
              onChange={(e) =>
                setregisterdatainformation((prev) => ({ ...prev, email: e.target.value.toLowerCase() }))
              }
              className="w-full h-12 rounded-lg border border-gray-300 px-4 transition duration-300 focus:ring-[#1e81b0] focus:outline-none hover:border-[#1e81b0]"
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>

          {/* <-- ADDED Phone Number input */}
          <div>
            <label className="block text-start text-md font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={registerdatainformation.phone}
              onChange={(e) =>
                setregisterdatainformation((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full h-12 rounded-lg border border-gray-300 px-4 transition duration-300 focus:ring-[#1e81b0] focus:outline-none hover:border-[#1e81b0]"
            />
            {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-start text-md font-bold text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={registerdatainformation.Password}
              onChange={(e) =>
                setregisterdatainformation((prev) => ({ ...prev, Password: e.target.value }))
              }
              onPaste={(e) => e.preventDefault()}
              onCopy={(e) => e.preventDefault()}
              className="w-full h-12 rounded-lg border border-gray-300 px-4 transition duration-300 focus:ring-[#1e81b0] focus:outline-none hover:border-[#1e81b0]"
            />
            {formErrors.Password && <p className="text-red-500 text-sm mt-1">{formErrors.Password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#1e81b0] text-white font-mono py-3 rounded-none transition transform duration-300 hover:scale-105"
          >
            REGISTER
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center text-gray-700 mt-8 text-md">
          <span>Returning Customer? </span>
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="border-b border-gray-700 hover:text-[#1745A2] hover:border-[#6f3333] transition duration-300 pb-1"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
