import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-200 px-4 py-12 flex flex-col items-center">

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          {t("about.title", "About Unity Darmarpan")}
        </h1>

        <p className="text-gray-700 mb-4 text-lg">
          {t(
            "about.description",
            "Unity Darmarpan is a charitable community dedicated to helping those in need. We work together to support education, health, and social welfare initiatives in our community."
          )}
        </p>

        <p className="text-gray-700 mb-4 text-lg">
          {t(
            "about.communityInfo",
            "By joining the Unity Darmarpan community, you can participate in meaningful charitable activities and make a real difference in people’s lives."
          )}
        </p>

        <p className="text-gray-700 mb-6 text-lg">
          {t(
            "about.donationInfo",
            "You can contribute by donating any amount between ₹50 to ₹1000. Your support helps us continue our mission and expand our reach to more people in need."
          )}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/donation")}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200"
          >
            {t("about.donateButton", "Donate Now")}
          </button>

          <button
            onClick={() => navigate("/direct-selling")}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200"
          >
            {t("about.joinButton", "Join Community")}
          </button>
        </div>
      </div>

      <div className="mt-12 text-center max-w-2xl text-gray-600 text-lg">
        <p>
          {t(
            "about.footer",
            "Your contribution, big or small, helps us bring hope and support to many. Join us today and be a part of the Unity Darmarpan movement!"
          )}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;