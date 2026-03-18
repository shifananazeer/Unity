import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

interface LayoutProps {
  role: "superadmin" | "admin" | "coordinator";
}

const Layout: React.FC<LayoutProps> = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getRoleName = () => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "coordinator":
        return "Coordinator";
      default:
        return "";
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} role={role} />

      <div className="flex-1 flex flex-col">
        <Navbar
          role={role}
          adminName={getRoleName()}
          toggleSidebar={() => setSidebarOpen(true)}
        />

        <div className="p-4 md:p-6 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;