import React, { useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import { clearCart } from './store/cartSlice';

export default function AuthVerify() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("userToken");
      if (token) {
        const { exp } = jwt_decode(token); // Decode to get expiration time
        if (exp * 1000 < Date.now()) { // Check if expired
          dispatch(logout());
          dispatch(clearCart());
          window.location.reload(); // Refresh UI after logout
        } else {
          // Set timer to auto logout exactly at token expiry time
          const timeout = setTimeout(() => {
            dispatch(logout());
            dispatch(clearCart());
            window.location.reload();
          }, exp * 1000 - Date.now());
          return () => clearTimeout(timeout); // Cleanup on unmount
        }
      }
    };
    checkToken();
  }, [dispatch]);

  return null; // No UI rendered
}
