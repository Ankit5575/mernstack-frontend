import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;
const getToken = () => localStorage.getItem("userToken") || "";

// ──────────────────────────────
// ✅ Fetch all orders (admin only)
// ──────────────────────────────
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/orders/all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return res.data; // ✅ Just return the array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all orders"
      );
    }
  }
);


// ──────────────────────────────
// ✅ Update order status (admin only)
// ──────────────────────────────
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await axios.put(
        `${BASE_URL}/api/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      return res.data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

// ──────────────────────────────
// 🔄 Slice Definition
// ──────────────────────────────
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    statusUpdateSuccess: false,
  },
  reducers: {
    resetAdminOrderState: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
      state.statusUpdateSuccess = false;
    },
    clearStatusUpdateSuccess: (state) => {
      state.statusUpdateSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // 📦 Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔧 Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdateSuccess = false;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
        state.statusUpdateSuccess = true;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload;
        state.statusUpdateSuccess = false;
      });
  },
});

export const { resetAdminOrderState, clearStatusUpdateSuccess } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
