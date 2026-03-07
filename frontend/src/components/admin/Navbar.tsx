import React from "react";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  adminName: string;
}

const Navbar: React.FC<NavbarProps> = ({ adminName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove auth token
    navigate("/login");
  };

  return (
    <div className="w-full h-16 bg-white shadow flex items-center justify-between px-6">
      
      {/* Left Section - Logo + Title */}
      <div className="flex items-center gap-3">
        <img
          src="/Unity Logo.jpeg"
          alt="logo"
          className="w-9 h-9 object-contain"
        />
        <h1 className="text-xl font-semibold text-gray-800">
          Super Admin Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        
        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-700 font-medium">{adminName}</span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default Navbar;