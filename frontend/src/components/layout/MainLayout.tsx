import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ flex: 1 }}>{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
