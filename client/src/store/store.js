import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice'
import productReducer from './productSlice'
import cartReducer from './cartSlice';
import addressReducer from './addressSlice';
import checkoutReducer from './checkoutSlice';
import additionalReducer from './additionalSlice'
    import razorpayReducer from './razorpaySlice';
    import orderReducer from './orderslice';
    import newsletterReducer from './newsletterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    address: addressReducer,
    checkout: checkoutReducer,
    additional: additionalReducer,
    razorpay: razorpayReducer,
    orders: orderReducer,
    newsletter: newsletterReducer,
  },
});

export default store;
