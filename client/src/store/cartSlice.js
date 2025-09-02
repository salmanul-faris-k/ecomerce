import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL for cart routes
const API = import.meta.env.VITE_BACKEND_URL + "/api/cart";

const loadCartFromStore=()=>{
    const storeCart=localStorage.getItem("cart")
    return storeCart?JSON.parse(storeCart):{products:[]}
}
const saveCartTostorage=(cart)=>{
    localStorage.setItem("cart",JSON.stringify(cart))
}
// Helper to get user token for auth headers
const getToken = () => localStorage.getItem("userToken");

const authHeaders = () => ({
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// --- Async thunks ---

// Add product to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity, sizes, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/addCart`,
        { productId, quantity, sizes, guestId, userId }      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity, sizes, guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/updateCart`,
        { productId, quantity, sizes, guestId, userId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete cart item
export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ productId, sizes, guestId, userId }, { rejectWithValue }) => {
    try {
      // Note: Your router DELETE calls updatecart, you might want to fix that. For now, using updateCart API.
      const response = await axios.delete(
        `${API}/deleteCart`,
        {
          data: { productId, sizes, guestId, userId }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get cart by userId or guestId
export const getCart = createAsyncThunk(
  "cart/getCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      

      const response = await axios.get(`${API}/getCart`, { params :userId,guestId});
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Merge guest cart with user cart after login
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/merge`,
        { guestId },
        { headers: authHeaders() }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// --- Slice ---

const initialState = {
  cart: loadCartFromStore(),
  loading: false,
  error: null,
  success: false,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    
    clearCart:(state)=>{
        state.cart={products:[]}
        localStorage.removeItem("cart")
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
    .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartTostorage(action.payload)
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })

      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartTostorage(action.payload)
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update item quntity";
      })

      // Delete cart item
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartTostorage(action.payload)
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove item";
      })

      // Get cart
      .addCase(getCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartTostorage(action.payload)
      })
      .addCase(getCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to get cart";
      })

      // Merge cart
           .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartTostorage(action.payload)
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to merge cart";
      })
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
