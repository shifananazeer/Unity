import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Admins", path: "/admin/admins" },
    { name: "Coordinators", path: "/admin/coordinators" },
    { name: "Payments", path: "/admin/payments" },
  ];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">

      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <div className="flex flex-col gap-2 p-4">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded transition ${
                isActive
                  ? "bg-blue-600"
                  : "hover:bg-gray-700"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

    </div>
  );
};

export default Sidebar;