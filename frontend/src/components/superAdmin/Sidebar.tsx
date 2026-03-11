import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const menu = [
    { name: "Dashboard", path: "/superadmin/dashboard" },
    { name: "Users", path: "/superadmin/users" },
    { name: "Admins", path: "/superadmin/admins" },
    { name: "Coordinators", path: "/superadmin/coordinators" },
    { name: "Payments", path: "/superadmin/payments" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          fixed md:static top-0 left-0 z-50
          w-64 h-screen bg-gray-900 text-white flex flex-col
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-6 text-2xl font-bold border-b border-gray-700 flex justify-between items-center">
          Admin Panel

          {/* Close button mobile */}
          <button
            className="md:hidden text-xl"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Menu */}
        <div className="flex flex-col gap-2 p-4">
          {menu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-2 rounded transition ${
                  isActive ? "bg-blue-600" : "hover:bg-gray-700"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;