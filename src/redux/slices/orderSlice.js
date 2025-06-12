import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("userToken") || "";

// ──────────────────────────────
// ✅ Fetch All Orders for User
// ──────────────────────────────
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data; // Must include `status` per order
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// ──────────────────────────────
// ✅ Fetch One Order by ID
// ──────────────────────────────
export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
  }
);

// ──────────────────────────────
// ✅ Admin: Update Order Status
// ──────────────────────────────
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/orders/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      return res.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update order status");
    }
  }
);

// ──────────────────────────────
// 🔄 Slice Definition
// ──────────────────────────────
const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    orderDetails: null,
    loadingOrders: false,
    loadingOrderDetails: false,
    updatingStatus: false,
    error: null,
  },
  reducers: {
    resetOrderState: (state) => {
      state.orders = [];
      state.orderDetails = null;
      state.loadingOrders = false;
      state.loadingOrderDetails = false;
      state.updatingStatus = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loadingOrders = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.error = action.payload;
      })

      // Fetch one order
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loadingOrderDetails = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loadingOrderDetails = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loadingOrderDetails = false;
        state.error = action.payload;
      })

      // Update status
      .addCase(updateOrderStatus.pending, (state) => {
        state.updatingStatus = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.updatingStatus = false;

        // Update in orders list
        const index = state.orders.findIndex((o) => o._id === updatedOrder._id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }

        // Update details page
        if (state.orderDetails?._id === updatedOrder._id) {
          state.orderDetails = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.updatingStatus = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
