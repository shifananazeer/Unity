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
  const [loading, setLoading] = useState(false);
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

  // const handlePayment = async () => {
  //   setLoading(true);
  //   try {
  //     await new Promise((res) => setTimeout(res, 300));
  //     setShowQrModal(true);
  //   } catch (error) {
  //     console.error("Payment initiation failed:", error);
  //     alert(t("hero.paymentError"));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <section
      className="relative h-[90vh] flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/hero-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent"></div>

      <div className="relative max-w-7xl mx-auto px-6 text-white text-center">
        <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
          {t("hero.tag")}
        </span>

        <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
          {t("hero.titleLine1")}
          <br />
          <span className="text-orange-400">{t("hero.titleHighlight")}</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-200 mx-auto">
          {t("hero.description")}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
         {isLoggedIn ? (
  <div className="flex flex-col md:flex-row gap-4">

    <button
      onClick={() => navigate("/donation")}
      className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg font-semibold"
    >
      {t("hero.unitydarmarpan")}
    </button>

    <button
      onClick={() => navigate("/direct-selling")}
      className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg font-semibold"
    >
      {t("hero.directSelling")}
    </button>

    <button
      onClick={() => navigate("/rd-community")}
      className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg font-semibold"
    >
      {t("hero.rdCommunity")}
    </button>

  </div>
) : (
  <button
    onClick={openSignup}
    className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold"
  >
    {t("hero.joinMission")}
  </button>
)}
          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
            {t("hero.learnMore")}
          </button>
        </div>
      </div>

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