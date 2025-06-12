import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch all users (Admin only)
export const fetchAllUsers = createAsyncThunk(
    "users/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            });
            return response.data; // Return the data
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Async thunk to create a new user (Admin only)
export const addUser = createAsyncThunk(
    "users/createUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Async thunk to update user info (Admin only)
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async ({ id, name, email, role }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
                { name, email, role },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("userToken")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Async thunk to delete a user (Admin only)
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            });
            return id; // Return the deleted user ID
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Slice to manage users state
const usersSlice = createSlice({
    name: "admin",
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch all users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create a new user
            .addCase(addUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Update a user
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
                if (userIndex !== -1) {
                    state.users[userIndex] = updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Delete a user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload;
            });
    }
});

export default usersSlice.reducer;
