import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base API URL
const API = import.meta.env.VITE_BACKEND_URL + "/api/Newsletter";

// Auth header helper
const getToken = () => localStorage.getItem("userToken");
const authHeaders = () => ({
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

/* -------------------- NEWSLETTER -------------------- */

// Subscribe (public)
export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribeNewsletter",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/newsletter`, { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all subscribers (admin)
export const fetchNewsletterSubscribers = createAsyncThunk(
  "newsletter/fetchNewsletterSubscribers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/newsletter`, {
        headers: authHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete subscriber (admin)
export const deleteNewsletterSubscriber = createAsyncThunk(
  "newsletter/deleteNewsletterSubscriber",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/newsletter/${id}`, {
        headers: authHeaders(),
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* -------------------- CONTACT -------------------- */

// Create contact message (public)
export const createContactMessage = createAsyncThunk(
  "newsletter/createContactMessage",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API}/contact`, formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get all contact messages (admin)
export const fetchContactMessages = createAsyncThunk(
  "newsletter/fetchContactMessages",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API}/contact`, {
        headers: authHeaders(),
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete contact message (admin)
export const deleteContactMessage = createAsyncThunk(
  "newsletter/deleteContactMessage",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API}/contact/${id}`, {
        headers: authHeaders(),
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

/* -------------------- SLICE -------------------- */

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState: {
    subscribers: [],
    contactMessages: [],
    loading: false,
    error: null,
    status: null,
  },
  reducers: {
    resetNewsletterError: (state) => {
      state.error = null;
    },
    resetNewsletterStatus: (state) => {
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ====== subscribe ====== */
      .addCase(subscribeNewsletter.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeNewsletter.fulfilled, (state) => {
        state.loading = false;
        state.status = "subscribed";
      })
      .addCase(subscribeNewsletter.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      /* ====== get subscribers ====== */
      .addCase(fetchNewsletterSubscribers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsletterSubscribers.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.subscribers = payload;
      })
      .addCase(fetchNewsletterSubscribers.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      /* ====== delete subscriber ====== */
      .addCase(deleteNewsletterSubscriber.fulfilled, (state, { payload }) => {
        state.subscribers = state.subscribers.filter((s) => s._id !== payload);
        state.status = "subscriberDeleted";
      })

      /* ====== create contact ====== */
      .addCase(createContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContactMessage.fulfilled, (state) => {
        state.loading = false;
        state.status = "contactCreated";
      })
      .addCase(createContactMessage.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      /* ====== get contact messages ====== */
      .addCase(fetchContactMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactMessages.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.contactMessages = payload;
      })
      .addCase(fetchContactMessages.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      /* ====== delete contact ====== */
      .addCase(deleteContactMessage.fulfilled, (state, { payload }) => {
        state.contactMessages = state.contactMessages.filter(
          (m) => m._id !== payload
        );
        state.status = "contactDeleted";
      });
  },
});

export const { resetNewsletterError, resetNewsletterStatus } =
  newsletterSlice.actions;

export default newsletterSlice.reducer;
