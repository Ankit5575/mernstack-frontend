import React, { useState } from "react";
import { FaBars } from "react-icons/fa6";
import AdminSidebar from "./AdminSidebar";
import { Outlet} from "react-router-dom";


function AdminLayout() {
  const [isSidebarOpen, setIssideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIssideBarOpen(!isSidebarOpen);
  };
  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      {/* MOBILE TOGGLE BUTTON  */}
      <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
        <button onClick={toggleSideBar}>
          <FaBars size={24} />
        </button>
          <h1 className="ml-4 text-4xl font-medium">Admin Dasbord</h1>
      </div>
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSideBar}
        ></div>
      )}
      {/* sidebar */}
      <div
        className={`bg-gray-900 w-64 min-h-screen text-white absolute md:relative transform ${
          isSidebarOpen ? "translate-x-0 " : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}
      >
        {/* SIDEBAR COMPONENTS */}
        <AdminSidebar/>
      </div>
      {/* MAIN CONTENT */}
      <div className="flex-grow p-6 overflow-auto">
 <Outlet/>
      </div>
    </div>
  );
}

export default AdminLayout;
