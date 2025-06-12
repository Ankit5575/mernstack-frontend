import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/products`, {
            headers: {
                Authorization: USER_TOKEN,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

// Async thunk to create a new product
export const createProduct = createAsyncThunk("adminProducts/createProduct",
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/admin/products`,
                productData, {
                    headers: {
                        Authorization: USER_TOKEN,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Async thunk to update an existing product
export const updateProduct = createAsyncThunk("adminProducts/updateProduct",
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/products/${id}`,
                productData, // Directly send productData
                {
                    headers: {
                        Authorization: USER_TOKEN,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Async thunk to delete a product
export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${API_URL}/api/products/${id}`, {
            headers: {
                Authorization: USER_TOKEN,
            },
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

// Slice to manage admin products state
const adminProductSlice = createSlice({
    name: "adminProducts",
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all products
            .addCase(fetchAdminProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAdminProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create a new product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update a product
            .addCase(updateProduct.fulfilled, (state, action) => {
                // const updatedProduct = action.payload;
                const index = state.products.findIndex((product) =>product._id === action.payload._id);
                if (index !== -1) {
                    // state.products[index] = updatedProduct;
                    state.products[index] =action.payload ;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete a product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.products = state.products.filter(product => product._id !== action.payload);
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default adminProductSlice.reducer;
