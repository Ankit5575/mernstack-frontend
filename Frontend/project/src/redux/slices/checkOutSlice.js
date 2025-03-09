import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to create a checkout session
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
      return rejectWithValue(error.response.data);
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null, // This holds the checkout session data
    loading: false, // Tracks loading state
    error: null, // Holds error messages
  },
  reducers: {
    // You can add additional reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle the pending state
      .addCase(createCheckOut.pending, (state) => {
        state.loading = true; // Corrected from `state.pending`
        state.error = null;
      })
      // Handle the fulfilled state
      .addCase(createCheckOut.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload; // Corrected to match `initialState`
      })
      // Handle the rejected state
      .addCase(createCheckOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Corrected to store the error message
      });
  },
});

export default checkoutSlice.reducer;