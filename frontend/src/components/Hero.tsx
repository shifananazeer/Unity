import React, { useState } from "react";
import AuthModal from "./AuthModal";

const Hero: React.FC = () => {

     const [openModal, setOpenModal] = useState(false);
  const [authType, setAuthType] = useState<"login" | "signup">("signup");

  const openSignup = () => {
    setAuthType("signup");
    setOpenModal(true);
  };
  return (
    <section
      className="relative h-[90vh] flex items-center"
      style={{
        backgroundImage: "url('/hero-image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/70 to-transparent"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-white">
        <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
          ❤️ Empowering Communities
        </span>

        <h1 className="text-5xl md:text-6xl font-bold mt-6 leading-tight">
          Building a Better <br />
          <span className="text-orange-400">Tomorrow, Together</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg text-gray-200">
          Unity is a social cultural organization committed to uplifting lives
          through education, healthcare, and community development programs.
        </p>

        <div className="mt-8 flex gap-4">
          <button
            onClick={openSignup}
           className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold">
            Join Our Mission →
          </button>

          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-black transition">
            Learn More
          </button>
        </div>
        
      </div>
      {openModal && (
        <AuthModal type={authType} onClose={() => setOpenModal(false)} />
      )}
    </section>
  );
};

export default Hero;