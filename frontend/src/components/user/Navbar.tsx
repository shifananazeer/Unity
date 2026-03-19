import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar: React.FC = () => {
  const [openModel, setOpenModel] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

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
    localStorage.removeItem("userId"); 
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <header className="w-full border-b bg-white">
  <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 px-4 md:px-8 py-3 flex justify-between items-center">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/Unity Logo.jpeg"
            alt="Unity Logo"
            className="w-9 h-9 rounded-full"
          />

          <div>
            <h1 className="text-base md:text-lg font-bold text-teal-700">
              UNITY
            </h1>
            <p className="text-[10px] md:text-xs text-gray-500">
              {t("navbar.tagline")}
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
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

        {/* Right Section Desktop */}
        <div className="hidden md:flex items-center gap-4">

          <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="en">English</option>
            <option value="ml">Malayalam</option>
          </select>

          {isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {t("navbar.profile")}
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              >
                {t("navbar.logout")}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={openLogin}
                className="hover:text-teal-600"
              >
                {t("navbar.login")}
              </button>

              <button
                onClick={openSignup}
                className="bg-teal-700 text-white px-4 py-2 rounded-lg hover:bg-teal-800"
              >
                {t("navbar.signup")}
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
     {mobileMenu && (
  <div className="md:hidden fixed top-16 left-0 w-full bg-white shadow-lg p-6 flex flex-col gap-4 z-40">

    <span
      onClick={() => {
        navigate("/");
        setMobileMenu(false);
      }}
      className="cursor-pointer"
    >
      {t("navbar.home")}
    </span>

    <span
      onClick={() => {
        navigate("/about");
        setMobileMenu(false);
      }}
      className="cursor-pointer"
    >
      {t("navbar.about")}
    </span>

    <select
      onChange={(e) => {
        changeLanguage(e.target.value);
        setMobileMenu(false);
      }}
      value={i18n.language}
      className="border rounded px-2 py-2"
    >
      <option value="en">English</option>
      <option value="ml">Malayalam</option>
    </select>

    {isLoggedIn ? (
      <>
        <button
          onClick={() => {
            navigate("/profile");
            setMobileMenu(false);
          }}
          className="bg-blue-600 text-white py-2 rounded-lg"
        >
          {t("navbar.profile")}
        </button>

        <button
          onClick={() => {
            handleLogout();
            setMobileMenu(false);
          }}
          className="bg-red-600 text-white py-2 rounded-lg"
        >
          {t("navbar.logout")}
        </button>
      </>
    ) : (
      <>
        <button
          onClick={() => {
            openLogin();
            setMobileMenu(false);
          }}
          className="border py-2 rounded-lg"
        >
          {t("navbar.login")}
        </button>

        <button
          onClick={() => {
            openSignup();
            setMobileMenu(false);
          }}
          className="bg-teal-700 text-white py-2 rounded-lg"
        >
          {t("navbar.signup")}
        </button>
      </>
    )}
  </div>
)}

      {openModel && (
        <AuthModal type={authType} onClose={() => setOpenModel(false)} />
      )}
    </header>
  );
};

export default Navbar;