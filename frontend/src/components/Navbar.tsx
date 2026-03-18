import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  role: "superadmin" | "admin" | "coordinator";
  adminName: string;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ role, adminName, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (role === "superadmin") {
      localStorage.removeItem("superAdminToken");
      navigate("/login/superadmin");
    } else if (role === "admin") {
      localStorage.removeItem("adminToken");
      navigate("/login/admin");
    } else if (role === "coordinator") {
      localStorage.removeItem("coordinatorToken");
      localStorage.removeItem("coordinatorId"); 
      navigate("/login/coordinator");
    }
  };

  const getTitle = () => {
    switch (role) {
      case "superadmin":
        return "Super Admin";
      case "admin":
        return "Admin";
      case "coordinator":
        return "Coordinator";
      default:
        return "Dashboard";
    }
  };

  const title = getTitle();

  return (
    <header className="w-full h-14 sm:h-16 bg-white shadow flex items-center justify-between px-3 sm:px-6">

      {/* LEFT */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Mobile Menu */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl text-gray-700"
        >
          ☰
        </button>

        {/* Logo */}
        <img
          src="/Unity Logo.jpeg"
          alt="logo"
          className="w-7 h-7 sm:w-9 sm:h-9 object-contain"
        />

        {/* Title */}
        <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-none">
          <span className="hidden sm:inline">{title} Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </h1>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4">

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            {adminName?.charAt(0).toUpperCase()}
          </div>

          {/* Hide name on mobile */}
          <span className="hidden md:block text-gray-700 font-medium">
            {adminName}
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm transition"
        >
          Logout
        </button>

      </div>
    </header>
  );
};

export default Navbar;