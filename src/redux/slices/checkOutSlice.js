import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create checkout session
export const createCheckOut = createAsyncThunk(
  "checkout/createCheckout",
  async (checkOutData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkOutData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Checkout failed";
      return rejectWithValue(message);
    }
  }
);

// Pay for the checkout session (PayPal)
export const payCheckout = createAsyncThunk(
  "checkout/payCheckout",
  async ({ checkoutId, paymentDetails }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "completed",
          paymentDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data; // includes updated checkout
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Payment failed";
      return rejectWithValue(message);
    }
  }
);

// Finalize the checkout into an order
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data.order._id; // ✅ Return order ID
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Finalization failed";
      return rejectWithValue(message);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
    success: false,

    paying: false,
    paymentSuccess: false,
    paymentError: null,

    finalizing: false,
    finalizeSuccess: false,
    finalizeError: null,

    finalizedOrderId: null, // ✅ Track order ID after finalization (optional use)
  },
  reducers: {
    resetCheckoutState: (state) => {
      state.checkout = null;
      state.loading = false;
      state.error = null;
      state.success = false;

      state.paying = false;
      state.paymentSuccess = false;
      state.paymentError = null;

      state.finalizing = false;
      state.finalizeSuccess = false;
      state.finalizeError = null;

      state.finalizedOrderId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create checkout
      .addCase(createCheckOut.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createCheckOut.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
        state.success = true;
      })
      .addCase(createCheckOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // Pay checkout
      .addCase(payCheckout.pending, (state) => {
        state.paying = true;
        state.paymentError = null;
        state.paymentSuccess = false;
      })
      .addCase(payCheckout.fulfilled, (state, action) => {
        state.paying = false;
        state.paymentSuccess = true;
        state.checkout = action.payload.checkout || state.checkout;
      })
      .addCase(payCheckout.rejected, (state, action) => {
        state.paying = false;
        state.paymentError = action.payload;
        state.paymentSuccess = false;
      })

      // Finalize checkout
      .addCase(finalizeCheckout.pending, (state) => {
        state.finalizing = true;
        state.finalizeError = null;
        state.finalizeSuccess = false;
        state.finalizedOrderId = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.finalizing = false;
        state.finalizeSuccess = true;
        state.finalizedOrderId = action.payload; // ✅ Save order ID here
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.finalizing = false;
        state.finalizeError = action.payload;
        state.finalizeSuccess = false;
      });
  },
});

export const { resetCheckoutState } = checkoutSlice.actions;
export default checkoutSlice.reducer;
