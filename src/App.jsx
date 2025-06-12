import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import { Toaster } from "sonner";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import CollectionPage from "./Pages/CollectionPage";
import ProdcutDetail from "./components/Product/ProdcutDetail";
import Checkout from "./components/Cart/Checkout";
import OrderConfirmatinPage from "./Pages/OrderConfirmatinPage";
import OrderDetaiil from "./Pages/OrderDetaiil";
import MyOrderPage from "./Pages/MyOrderPage";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminHome from "./Pages/AdminHome";
import UserMangement from "./components/Admin/UserMangement";
import ProductMange from "./components/Admin/ProductMange";
import EditProduct from "./components/Admin/EditProduct";
import OrderMangement from "./components/Admin/OrderMangement";


import { Provider } from "react-redux";
import store from "./redux/slices/store"
import ProducttedRoute from "./components/Common/ProducttedRoute";

function App() {






  return (
    <Provider store={store} >
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Main Layout Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />  
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProdcutDetail />} />
          <Route path="checkout" element={<Checkout />} />
          {/* <Route path="order-confirmation" element={<OrderConfirmatinPage />} /> */}
          <Route path="order/:id" element={<OrderDetaiil />} />
          <Route path="order/:id/my-orders" element={<MyOrderPage />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmatinPage/>} />
        </Route>

        {/* Admin Layout Routes */}
        <Route path="/admin" element={ <ProducttedRoute role="admin" >
          <AdminLayout/>
        
        </ProducttedRoute>}>
          <Route index element={<AdminHome />} /> {/* ✅ Correct Admin index route */}
          <Route path="/admin/users" element={<UserMangement/>}/>
          <Route path="product" element={<ProductMange/>}/>
          <Route path="/admin/products/:id/edit" element={<EditProduct />} />
          <Route path="order" element={<OrderMangement/>} />
 
         </Route>
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
