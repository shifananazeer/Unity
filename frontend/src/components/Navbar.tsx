import React, { useState } from "react";
import AuthModal from "./AuthModal";

const Navbar: React.FC = () => {
    const [openModel, setOpenModel] = useState(false);
    const [authType, setAuthType] = useState<"login" | "signup">("login");


    const openLogin = () => {
        setAuthType("login");
        setOpenModel(true);
    }

    const openSignup = () => {
        setAuthType("signup");
        setOpenModel(true);
    }
  return (
    <header className="w-full border-b bg-white">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <img
            src="/Unity Logo.jpeg"
            alt="Unity Logo"
            className="w-10 h-10 rounded-full"
          />

          <div>
            <h1 className="text-lg font-bold text-teal-700">UNITY</h1>
            <p className="text-xs text-gray-500">
              A Social Cultural Organization
            </p>
          </div>
        </div>

        {/* Navigation */}
       <ul className="flex items-center gap-8 text-gray-700 font-medium">
       <li className="hover:text-teal-600 cursor-pointer">Home</li>
       <li className="hover:text-teal-600 cursor-pointer">About</li>
       </ul>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button 
          onClick={openLogin}
          className="text-gray-700 hover:text-teal-600 font-medium">
            Log In
          </button>

          <button 
          onClick={openSignup}
          className="bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition">
            Sign Up
          </button>
        </div>
        {openModel && (
            <AuthModal type={authType} onClose={() => setOpenModel(false)} />
        )}
      </nav>
    </header>
  );
};

export default Navbar;