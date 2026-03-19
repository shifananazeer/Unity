import path from "path";
import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  role: "superadmin" | "admin" | "coordinator";
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, role }) => {

  const menuItems = {
    superadmin: [
      { name: "Dashboard", path: "/superadmin/dashboard" },
      { name: "Unity Members", path: "/superadmin/users" },
      { name: "Unity Admins", path: "/superadmin/admins" },
      { name: "Unity Coordinators", path: "/superadmin/coordinators" },
      { name: "Unity Payments", path: "/superadmin/payments" },
      // { name: "QR management " , path: "/superadmin/qrcode"}
      { name: "Creater Profile" , path:"/superadmin/profile"}
    ],

    admin: [
      { name: "Dashboard", path: "/admin/dashboard" },
      { name: "Unity Members", path: "/admin/users" },
      { name: "Unity Coordinators", path: "/admin/coordinators" },
      { name: "Unity Payments", path: "/admin/payments" },
      { name: "UPI Management", path: "/admin/upi" },
       { name : "Missed Payments" , path: "/admin/missedPayments"},
       { name: "Incharge Profile" , path:"/admin/profile"}
    ],

    coordinator: [
      { name: "Dashboard", path: "/coordinator/dashboard" },
      { name: "Unity Members", path: "/coordinator/users" },
      { name: "Unity Payments", path: "/coordinator/payments" },
     { name: "UPI Management", path: "/coordinator/upi" },
      { name: "Coordinator Profile", path: "/coordinator/profile" },
      { name : "Missed Payments" , path: "/coordinator/missedPayments"}
      
    ],
  };

  const panelTitle = {
    superadmin: "Unity Creater Panel",
    admin: "Unity Incharge Panel",
    coordinator: "Unity Coordinator Panel",
  };

  const menu = menuItems[role];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 z-50 w-64 h-screen bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Title */}
        <div className="p-6 text-2xl font-bold border-b border-gray-700 flex justify-between items-center">
          {panelTitle[role]}
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