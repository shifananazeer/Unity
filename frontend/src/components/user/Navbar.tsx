import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
    const [openModel, setOpenModel] = useState(false);
    const [authType, setAuthType] = useState<"login" | "signup">("login");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();


  // Check token on mount and listen for auth changes
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin(); 

    // Listen for login/logout events
    window.addEventListener("authChange", checkLogin);

    return () => {
      window.removeEventListener("authChange", checkLogin);
    };
  }, []);
    const openLogin = () => {
        setAuthType("login");
        setOpenModel(true);
    }

    const openSignup = () => {
        setAuthType("signup");
        setOpenModel(true);
    }

    const handleLogout = () => {
  localStorage.removeItem("token");

  // Update Navbar state
  setIsLoggedIn(false);

  // Dispatch event so Hero updates too
  window.dispatchEvent(new Event("authChange"));
   navigate("/");
};



  return (
    <header className="w-full border-b bg-white">
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-4 flex justify-between">
        
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
          {isLoggedIn ? (<>
            <button
            onClick={() => navigate("/profile")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="text-gray-700 hover:text-teal-600 font-medium"
              >
                Log In
              </button>
              <button
                onClick={openSignup}
                className="bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
        {openModel && (
            <AuthModal type={authType} onClose={() => setOpenModel(false)} />
        )}
      </nav>
    </header>
  );
};

export default Navbar;