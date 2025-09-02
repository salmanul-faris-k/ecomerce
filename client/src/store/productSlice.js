import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Get token from localStorage for authenticated routes
const API = import.meta.env.VITE_BACKEND_URL + "/api/product";
const getToken = () => localStorage.getItem("userToken");

const defaultHeaders = () => ({
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

// ----------------------- ASYNC THUNKS -----------------------

// Add Product (admin only, with images)
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API}/addproduct`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...defaultHeaders(),
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Edit Product (admin only, with images, PATCH or PUT)
export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API}/editproduct/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...defaultHeaders(),
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete Product (admin only)
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${API}/deleteproduct/${id}`,
        { headers: defaultHeaders() }
      );
      return response.data; // deleted product
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get all products (with query support)
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async ({ ProductType, Pattern, Fabric, Fit, sizes, minPrice, maxPrice, sortBy, search ,limit}) => {
    const query=new URLSearchParams()
    if(ProductType) query.append("ProductType",ProductType)
          if(Pattern) query.append("Pattern",Pattern)
    if(Fabric) query.append("Fabric",Fabric)
    if(Fit) query.append("Fit",Fit)
    if(sizes) query.append("sizes",sizes)
    if(minPrice) query.append("minPrice",minPrice)
    if(maxPrice) query.append("maxPrice",maxPrice)
    if(sortBy) query.append("sortBy",sortBy)
    if(search) query.append("search",search)
    if(limit) query.append("limit",limit)
  const response = await axios.get(
        `${API}/getproduct?${query.toString() }`
      );   
      return response.data
      
  }
);




// Get bestseller products


export const fetchBestsellers = createAsyncThunk(
  "product/fetchBestsellers",
  async ({ ProductType, Pattern, Fabric, Fit, sizes, minPrice, maxPrice, sortBy, search ,limit}) => {
    const query=new URLSearchParams()
    if(ProductType) query.append("ProductType",ProductType)
          if(Pattern) query.append("Pattern",Pattern)
    if(Fabric) query.append("Fabric",Fabric)
    if(Fit) query.append("Fit",Fit)
    if(sizes) query.append("sizes",sizes)
    if(minPrice) query.append("minPrice",minPrice)
    if(maxPrice) query.append("maxPrice",maxPrice)
    if(sortBy) query.append("sortBy",sortBy)
    if(search) query.append("search",search)
    if(limit) query.append("limit",limit)
  const response = await axios.get(
        `${API}/bestnsellerproduct?${query.toString() }`
      );   
      return response.data
      
  }
);


// Get single product by id
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/getproduct/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get similar products
export const fetchSimilarProducts = createAsyncThunk(
  "product/fetchSimilarProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/getsimilerproduct/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);




// Get "New In" products
export const fetchNewInProducts = createAsyncThunk(
  "product/fetchNewInProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/Newin`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------------- SLICE CONFIG -----------------------

const initialState = {
  products: [],
  product: null,
  similarProducts: [],
  bestsellers: [],
  newProducts: [],
  loading: false,
  error: null,
  success: false,
  filter:{ ProductType:"", Pattern:"", Fabric:"", Fit:"", sizes:"", minPrice:"", maxPrice:"", sortBy:"", search :""}
};

// ----------------------- PRODUCT SLICE -----------------------

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setfilters:(state,action)=>{
      state.filter={...state.filter,...action.payload}
    },
    clearfilters:(state)=>{
      state.filter={
        ProductType:"", Pattern:"", Fabric:"", Fit:"", sizes:"", minPrice:"", maxPrice:"", sortBy:"", search :""
      }
    },
    resetProductState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.product = null;
    },
  },
  extraReducers: (builder) => {
    // Add Product
    builder
      .addCase(addProduct.pending, (state) => {
        state.loading = true; state.error = null; state.success = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false; state.success = true; state.product = action.payload;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false; state.error = action.payload || "Add product error!";
      });

    // Edit Product
    builder
      .addCase(editProduct.pending, (state) => {
        state.loading = true; state.error = null; state.success = false;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false; state.success = true; state.product = action.payload;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false; state.error = action.payload || "Edit product error!";
      });

    // Delete Product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true; state.error = null; state.success = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false; state.success = true; 
        state.products = state.products.filter(
          (p) => p._id !== action.payload._id
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message|| "Delete error!";
      });

    // Fetch all products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false; state.products =Array.isArray(action.payload)?action.payload:[] ;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message ;
      });

    // Fetch single product
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true; state.error = null; state.product = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false; state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message || "Fetch product error!";
      });

    // Fetch similar products
    builder
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false; state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false; state.error =action.error.message || "Similar products error!";
      });

    // Fetch bestsellers
  builder
      .addCase(fetchBestsellers.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchBestsellers.fulfilled, (state, action) => {
        state.loading = false; state.bestsellers =Array.isArray(action.payload)?action.payload:[] ;
      })
      .addCase(fetchBestsellers.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message ;
      });

    // Fetch new-in
    builder
      .addCase(fetchNewInProducts.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchNewInProducts.fulfilled, (state, action) => {
        state.loading = false; state.newProducts = action.payload;
      })
      .addCase(fetchNewInProducts.rejected, (state, action) => {
        state.loading = false; state.error = action.error.message || "New-in error!";
      });
  }
});


export const {setfilters,clearfilters,resetProductState}=productSlice.actions;
export default productSlice.reducer;