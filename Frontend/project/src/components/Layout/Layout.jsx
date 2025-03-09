import React from "react";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <>
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main>
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Layout;
