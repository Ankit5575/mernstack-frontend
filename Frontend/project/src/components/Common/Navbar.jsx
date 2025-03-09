import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { FaShoppingBag } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { useSelector } from "react-redux";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const {user} = useSelector((state)=>state.auth)

  const toggleNavDrawerOpen = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCart = () => {
    setDrawerOpen(!drawerOpen);
  };

  const { cart } = useSelector((state) => state.cart);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Left Logo */}
        <div>
          <Link to="/" className="text-2xl font-medium">
            Kids
          </Link>
        </div>

        {/* Center Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {
            user && user.role === 'admin' && (
<Link
            to="/admin"
            className="block bg-black px-2 rounded text-sm text-white"
          >
            Admin
          </Link>
            )
          }
          
          <Link to="/profile" className="hover:text-black">
            <HiOutlineUserCircle className="w-6 h-6 text-gray-700" />
          </Link>

          {/* Cart Button */}
          <button onClick={toggleCart} className="relative hover:text-black">
            <FaShoppingBag className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search Bar */}
          <SearchBar />

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleNavDrawerOpen}>
            <FiMenu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer drawerOpen={drawerOpen} toggleCart={toggleCart} />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/3 h-full bg-white shadow-lg transform 
        transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawerOpen}>
            <IoMdCloseCircleOutline className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              className="block text-gray-600 hover:text-black"
              onClick={toggleNavDrawerOpen}
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              className="block text-gray-600 hover:text-black"
              onClick={toggleNavDrawerOpen}
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              className="block text-gray-600 hover:text-black"
              onClick={toggleNavDrawerOpen}
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              className="block text-gray-600 hover:text-black"
              onClick={toggleNavDrawerOpen}
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;