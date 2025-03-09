import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

// Fetch all orders (Admin only)
export const fetchAllOrders = createAsyncThunk(
    "adminOrders/fetchAllOrders",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/orders`, {
                headers: {
                    Authorization: USER_TOKEN,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Update order delivery status (Admin only)
export const updateOrderStatus = createAsyncThunk(
    "adminOrders/updateOrderStatus",
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${API_URL}/api/admin/orders/${id}`,
                { status }, // Send status in request body
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

// Delete an order (Admin only)
export const deleteOrder = createAsyncThunk(
    "adminOrders/deleteOrder",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/api/admin/orders/${id}`, {
                headers: {
                    Authorization: USER_TOKEN,
                },
            });
            return id; // Return the deleted order ID
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

const adminOrderSlice = createSlice({
    name: "adminOrders",
    initialState: {
        orders: [],
        totalOrders: 0,
        totalSales: 0,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        // Fetch all orders
        builder.addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;

            // Calculate total sales and total orders
            state.totalSales = action.payload.reduce((acc, order) => acc + order.totalPrice, 0);
            state.totalOrders = action.payload.length;
        });
        builder.addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Update order status
        builder.addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
            const updatedOrder = action.payload;
            state.orders = state.orders.map((order) =>
                order._id === updatedOrder._id ? updatedOrder : order
            );

            // Recalculate total sales after updating an order
            state.totalSales = state.orders.reduce((acc, order) => acc + order.totalPrice, 0);
        });
        builder.addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Delete an order
        builder.addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = state.orders.filter((order) => order._id !== action.payload);

            // Recalculate total sales and total orders after deletion
            state.totalSales = state.orders.reduce((acc, order) => acc + order.totalPrice, 0);
            state.totalOrders = state.orders.length;
        });
        builder.addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default adminOrderSlice.reducer;