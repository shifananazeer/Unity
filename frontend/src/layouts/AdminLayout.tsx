import React, { useState } from "react";
import Navbar from "../components/admin/Navbar";
import Sidebar from "../components/admin/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen">

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <Navbar
          adminName="Super Admin"
          toggleSidebar={() => setSidebarOpen(true)}
        />

        {/* Page Content */}
        <div className="p-4 md:p-6 flex-1 overflow-y-auto">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default AdminLayout;