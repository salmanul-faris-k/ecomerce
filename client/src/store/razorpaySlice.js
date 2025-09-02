import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL + "/api/razorpay";

// 🔐 Get auth headers if needed
const getToken = () => localStorage.getItem("userToken");
const defaultHeaders = () => ({
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// 👉 1. CREATE Razorpay Order
export const createRazorpayOrder = createAsyncThunk(
  "razorpay/create-order",
  async ({ amount, currency = "INR" }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/create-order`,
        { amount, currency },
        { headers: defaultHeaders() }
      );
      return response.data; // includes order_id, amount, currency
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 👉 2. VERIFY Razorpay Payment (optional if you're already verifying during `handler`)
export const verifyRazorpayPayment = createAsyncThunk(
  "razorpay/verifyPayment",
  async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/verify-payment`,
        { razorpay_order_id, razorpay_payment_id, razorpay_signature },
        { headers: defaultHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🧾 Slice
const razorpaySlice = createSlice({
  name: "razorpay",
  initialState: {
    order: null,
    loading: false,
    error: null,
    verified: false,
  },
  reducers: {
    resetRazorpayState: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
      state.verified = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // create order
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create order";
      })

      // verify payment
      .addCase(verifyRazorpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.verified = action.payload?.status === "success";
      })
      .addCase(verifyRazorpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signature verification failed";
      });
  },
});

export const { resetRazorpayState } = razorpaySlice.actions;
export default razorpaySlice.reducer;
