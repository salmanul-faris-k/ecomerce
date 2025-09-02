import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to get auth token header for requests
const getToken = () => localStorage.getItem("userToken");
const defaultHeaders = () => ({
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// API base URL for checkout routes
const CHECKOUT_API = import.meta.env.VITE_BACKEND_URL + "/api/checkout";

// Async thunk to create checkout
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CHECKOUT_API}/`,
        checkoutData,
        { headers: { "Content-Type": "application/json", ...defaultHeaders() } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to update payment status of checkout
export const updateCheckoutPayment = createAsyncThunk(
  "checkout/updateCheckoutPayment",
  async ({ id, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${CHECKOUT_API}/${id}/pay`,
        paymentData,
        { headers: { "Content-Type": "application/json", ...defaultHeaders() } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async thunk to finalize checkout and convert to order
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${CHECKOUT_API}/${id}/finalize`,
        {},
        { headers: { ...defaultHeaders() } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  checkout: null,
  loading: false,
  error: null,
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder
      // createCheckout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create checkout";
      })

      // updateCheckoutPayment
      .addCase(updateCheckoutPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateCheckoutPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.checkout = action.payload;
      })
      .addCase(updateCheckoutPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update payment status";
      })

      // finalizeCheckout
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.order = action.payload;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to finalize checkout";
      });
  },
});

export default checkoutSlice.reducer;
