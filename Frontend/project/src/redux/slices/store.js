import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';  // ✅ Import your reducer
import productReducer from "./productsSilce"
import cartReducer from "./cartSlice"
import checkoutReducer from "./checkOutSlice"
import orderReducer from './orderSlice'
import adminReducer from "./adminSlice"
import adminProductReducer from "./adminProductSlice"
import adminOrdersReducer from "./adminOrderSlice"
 
const store = configureStore({
    reducer: {
        auth: authReducer,  // ✅ Add reducer properly
        products:productReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
        orders:orderReducer,
        admin:adminReducer,
        adminProducts:adminProductReducer,
        adminOrders : adminOrdersReducer,
    }
});

export default store;
