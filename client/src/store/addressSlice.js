import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Helper to add auth header
const getAuthConfig = () => {
  const token = localStorage.getItem("userToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

// GET all addresses
export const getAddresses = createAsyncThunk(
  "address/getAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/Adress`,
        getAuthConfig()
      );
      return response.data;
    } catch (err) {
      const msg =
        err.response && err.response.data ? err.response.data : err.message;
      return rejectWithValue(msg);
    }
  }
);

// ADD new address
export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/Adress`,
        addressData,
        getAuthConfig()
      );
      return response.data;
    } catch (err) {
      const msg =
        err.response && err.response.data ? err.response.data : err.message;
      return rejectWithValue(msg);
    }
  }
);

// EDIT/update address
export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/Adress/${id}`,
        addressData,
        getAuthConfig()
      );
      return response.data;
    } catch (err) {
      const msg =
        err.response && err.response.data ? err.response.data : err.message;
      return rejectWithValue(msg);
    }
  }
);

// DELETE address
export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/Adress/${id}`,
        getAuthConfig()
      );
      return id;
    } catch (err) {
      const msg =
        err.response && err.response.data ? err.response.data : err.message;
      return rejectWithValue(msg);
    }
  }
);

// GET single address by ID
export const getSingleAddress = createAsyncThunk(
  "address/getSingleAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/Adress/${id}`,
        getAuthConfig()
      );
      return response.data;
    } catch (err) {
      const msg =
        err.response && err.response.data ? err.response.data : err.message;
      return rejectWithValue(msg);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addresses: [],
    singleAddress: null, // To store a single address fetched
    loading: false,
    error: null,
    status: null,
  },
  reducers: {
    resetAddressError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = null;
    },
    resetSingleAddress: (state) => {
      state.singleAddress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET all addresses
      .addCase(getAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(getAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
        state.status = null;
      })
      .addCase(getAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = null;
      })

      // ADD new address
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = [action.payload, ...state.addresses];
        state.status = "added";
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "error";
      })

      // UPDATE address
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
        state.status = "updated";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "error";
      })

      // DELETE address
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = state.addresses.filter((a) => a._id !== action.payload);
        state.status = "deleted";
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "error";
      })

      // GET single address
      .addCase(getSingleAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = null;
        state.singleAddress = null;
      })
      .addCase(getSingleAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.singleAddress = action.payload;
        state.status = "fetchedSingle";
      })
      .addCase(getSingleAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = "error";
        state.singleAddress = null;
      });
  },
});

export const { resetAddressError, resetStatus, resetSingleAddress } = addressSlice.actions;
export default addressSlice.reducer;
