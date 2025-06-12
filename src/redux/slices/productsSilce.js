// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import axios from "axios";


// Helper function to build query parameters
const buildQueryParams = (filters) => {
  const params = new URLSearchParams();
  const validFilters = [
    "collection",
    "size",
    "color",
    "gender",
    "minPrice",
    "maxPrice",
    "sortBy",
    "search",
    "category",
    "material",
    "brand",
    "limit",
  ];

  validFilters.forEach((filter) => {
    const value = filters[filter];
    if (value && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(filter, v));
      } else {
        params.append(filter, value);
      }
    }
  });

  return params.toString();
};

// Async Thunk to Fetch Products by Filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?${buildQueryParams(filters)}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch products"
      );
    }
  }
);

// Async Thunk to Fetch a Single Product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch product details"
      );
    }
  }
);

// Async Thunk to Update a Product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update product"
      );
    }
  }
);

 
// );
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch similar products"
      );
    }
  }
);

// Async Thunk to Fetch Best Sellers
export const fetchBestSellers = createAsyncThunk(
  "products/fetchBestSellers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch best sellers"
      );
    }
  }
);

// Products Slice
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    bestSellers: [],
    loading: false,
    error: null,
    filters: {
      category: "",
      size: [],
      color: [],
      gender: "",
      brand: "",
      maxPrice: "",
      minPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: [],
        color: [],
        gender: "",
        brand: "",
        maxPrice: "",
        minPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
    resetProductsState: (state) => {
      state.products = [];
      state.selectedProduct = null;
      state.similarProducts = [];
      state.bestSellers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex((p) => p._id === updatedProduct._id);
        if (index !== -1) state.products[index] = updatedProduct;
        if (state.selectedProduct?._id === updatedProduct._id) {
          state.selectedProduct = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Similar Products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Best Sellers
      .addCase(fetchBestSellers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.loading = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, resetProductsState } = productsSlice.actions;
export default productsSlice.reducer;