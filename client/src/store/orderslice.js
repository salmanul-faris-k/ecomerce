import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL + "/api/order";

const getToken = () => localStorage.getItem("userToken");
const authHeaders = () => ({
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// Fetch user's own orders
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/my-order`, {
        headers: authHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch all orders (admin only)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/allorder`, {
        headers: authHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update order status (admin)
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/${id}`,
        { status },
        { headers: authHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete an order (admin)
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API}/${id}`, {
        headers: authHeaders(),
      });
      return { id, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  myOrders: [],
  allOrders: [],
  totalsales: 0,
  totalorders: 0,
  loading: false,
  error: null,
  success: false,
};

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ---- My Orders ----
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myOrders = payload;
        state.success = true;
      })
      .addCase(fetchMyOrders.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to fetch my orders";
      })

      // ---- All Orders (admin) ----
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.allOrders = payload;
        state.totalorders = payload.length;
        state.totalsales = payload.reduce(
          (acc, order) => acc + order.totalprice,
          0
        );
        state.success = true;
      })
      .addCase(fetchAllOrders.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to fetch all orders";
      })

      // ---- Update Order ----
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        const index = state.allOrders.findIndex((o) => o._id === payload._id);
        if (index !== -1) {
          state.allOrders[index] = payload;
        }
      })
      .addCase(updateOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to update order";
      })

      // ---- Delete Order ----
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
        state.allOrders = state.allOrders.filter((o) => o._id !== payload.id);
      })
      .addCase(deleteOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload || "Failed to delete order";
      });
  },
});

export default orderSlice.reducer;
