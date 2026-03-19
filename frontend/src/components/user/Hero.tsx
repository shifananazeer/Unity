import React, { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import PaymentQrModal from "./PaymentQrModal";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Hero: React.FC = () => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [authType, setAuthType] = useState<"signup" | "login">("signup");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const navigate = useNavigate();

  const checkLogin = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  useEffect(() => {
    checkLogin();
    window.addEventListener("authChange", checkLogin);
    return () => window.removeEventListener("authChange", checkLogin);
  }, []);

  const openSignup = () => {
    setAuthType("signup");
    setOpenModal(true);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4"
      style={{
        backgroundImage: "url('/hero-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto text-white text-center w-full">
        <span className="bg-white/20 px-4 py-2 rounded-full text-xs sm:text-sm">
          {t("hero.tag")}
        </span>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mt-6 leading-tight">
          {t("hero.titleLine1")}
          <br />
          <span className="text-orange-400">
            {t("hero.titleHighlight")}
          </span>
        </h1>

        {/* Description */}
        <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-lg text-gray-200 mx-auto">
          {t("hero.description")}
        </p>

        {/* Buttons */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center gap-3 w-full max-w-xs mx-auto">

          {isLoggedIn ? (
            <div className="flex flex-col gap-3 w-full">

              <button
                onClick={() => navigate("/donation")}
                className="w-full bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                {t("hero.unitydarmarpan")}
              </button>

              <button
                onClick={() => navigate("/direct-selling")}
                className="w-full bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                {t("hero.directSelling")}
              </button>

              <button
                onClick={() => navigate("/rd-community")}
                className="w-full bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                {t("hero.rdCommunity")}
              </button>

            </div>
          ) : (
            <button
              onClick={openSignup}
              className="w-full bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold transition"
            >
              {t("hero.joinMission")}
            </button>
          )}

          {/* Learn More */}
          <button
            onClick={() => navigate("/about")}
            className="w-full border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition"
          >
            {t("hero.learnMore")}
          </button>
        </div>
      </div>

      {/* Modals */}
      {openModal && (
        <AuthModal type={authType} onClose={() => setOpenModal(false)} />
      )}

      <PaymentQrModal
        visible={showQrModal}
        onClose={() => setShowQrModal(false)}
      />
    </section>
  );
};

export default Hero;