import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL + "/api/auth";
const getToken = () => localStorage.getItem("userToken");

const defaultHeaders = () => ({
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ----------- ASYNC THUNKS -----------

// Add additional image
export const addAdditionalImage = createAsyncThunk(
  "additional/addAdditionalImage",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/addimage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...defaultHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all additional images (admin/user)
export const fetchAdditionalImages = createAsyncThunk(
  "additional/fetchAdditionalImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/getimage`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete an additional image by id
export const deleteAdditionalImage = createAsyncThunk(
  "additional/deleteAdditionalImage",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: defaultHeaders(),
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------- INITIAL STATE -----------

const initialState = {
  additionalImages: [],
  loading: false,
  error: null,
  success: false,
};

// ----------- SLICE -----------

const additionalSlice = createSlice({
  name: "additional",
  initialState,
  reducers: {
    resetAdditionalState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add additional image
      .addCase(addAdditionalImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addAdditionalImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.additionalImages.push(action.payload);
      })
      .addCase(addAdditionalImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add image";
      })

      // Fetch all additional images
      .addCase(fetchAdditionalImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdditionalImages.fulfilled, (state, action) => {
        state.loading = false;
        state.additionalImages = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAdditionalImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch additional images";
      })

      // Delete additional image
      .addCase(deleteAdditionalImage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAdditionalImage.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.additionalImages = state.additionalImages.filter(
          (img) => img._id !== action.payload._id
        );
      })
      .addCase(deleteAdditionalImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete image";
      });
  },
});

export const { resetAdditionalState } = additionalSlice.actions;
export default additionalSlice.reducer;
