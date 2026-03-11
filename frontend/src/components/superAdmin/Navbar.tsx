import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  adminName: string;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ adminName, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  return (
    <div className="w-full h-14 md:h-16 bg-white shadow flex items-center justify-between px-3 md:px-6">
      
      {/* Left Section */}
      <div className="flex items-center gap-2 md:gap-3">
        <button
  className="md:hidden text-2xl mr-3"
  onClick={toggleSidebar}
>
  ☰
</button>
        <img
          src="/Unity Logo.jpeg"
          alt="logo"
          className="w-7 h-7 md:w-9 md:h-9 object-contain"
        />

        {/* Hide full title on very small screens */}
        <h1 className="text-sm md:text-xl font-semibold text-gray-800 whitespace-nowrap">
          <span className="hidden sm:inline">Super Admin Dashboard</span>
          <span className="sm:hidden">Dashboard</span>
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-4">

        {/* Avatar + Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm md:text-base">
            {adminName.charAt(0).toUpperCase()}
          </div>

          {/* Hide name on small screens */}
          <span className="hidden md:block text-gray-700 font-medium">
            {adminName}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;