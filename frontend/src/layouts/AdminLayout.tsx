import React from "react";
import Sidebar from "../components/admin/sidebar";
import Navbar from "../components/admin/navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar adminName="Super Admin" />

        {/* Page Content */}
        <div className="p-6 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;