import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const [openModel, setOpenModel] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Language change
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  // Check login state
  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();

    window.addEventListener("authChange", checkLogin);

    return () => {
      window.removeEventListener("authChange", checkLogin);
    };
  }, []);

  const openLogin = () => {
    setAuthType("login");
    setOpenModel(true);
  };

  const openSignup = () => {
    setAuthType("signup");
    setOpenModel(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <header className="w-full border-b bg-white">
      <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-6 py-4 flex justify-between items-center">
        
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
              {t("navbar.tagline")}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <ul className="flex items-center gap-8 text-gray-700 font-medium">
          <li
            onClick={() => navigate("/")}
            className="hover:text-teal-600 cursor-pointer"
          >
            {t("navbar.home")}
          </li>

          <li
            onClick={() => navigate("/about")}
            className="hover:text-teal-600 cursor-pointer"
          >
            {t("navbar.about")}
          </li>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Language Selector */}
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="en">English</option>
            <option value="ml">Malayalam</option>
          </select>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                {t("navbar.profile")}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition"
              >
                {t("navbar.logout")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="text-gray-700 hover:text-teal-600 font-medium"
              >
                {t("navbar.login")}
              </button>

              <button
                onClick={openSignup}
                className="bg-teal-700 text-white px-5 py-2 rounded-lg hover:bg-teal-800 transition"
              >
                {t("navbar.signup")}
              </button>
            </>
          )}
        </div>

        {/* Auth Modal */}
        {openModel && (
          <AuthModal type={authType} onClose={() => setOpenModel(false)} />
        )}
      </nav>
    </header>
  );
};

export default Navbar;