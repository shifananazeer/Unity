import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  joinCommunity,
  getCommunityStatus
} from "../../services/user/profileService";

const DirectSellingPage: React.FC = () => {
  const { t } = useTranslation();

  const [joined, setJoined] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("Elements Unity");

  const handleJoin = async () => {
    try {
      const data = await joinCommunity(selectedPackage);
      alert(data.message);

      setJoined(true);
      setShowConfirmModal(false);
      setShowPackageModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to join community");
    }
  };

  const handleViewPackage = async () => {
    try {
      const status = await getCommunityStatus();
      setJoined(status.joined);

      if (!status.joined) {
        setShowPackageModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <div className="bg-white p-8 rounded-xl shadow-lg text-center">

        <h2 className="text-2xl font-bold mb-4">
          {t("community.title")}
        </h2>

        {joined ? (
          <p className="text-green-600 font-semibold">
            {t("community.joined")}
          </p>
        ) : (
          <button
            onClick={handleViewPackage}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            {t("community.viewPackage")}
          </button>
        )}

      </div>

      {/* Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">

            <h3 className="text-xl font-bold mb-4">
              {t("community.selectPackage")}
            </h3>

            <label className="flex items-center gap-3 mb-4">
              <input
                type="radio"
                value="Elements Unity"
                checked={selectedPackage === "Elements Unity"}
                onChange={(e) => setSelectedPackage(e.target.value)}
              />
              {t("community.elementsUnity")}
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPackageModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                {t("common.cancel")}
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                {t("community.join")}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 text-center">

            <h3 className="text-xl font-bold mb-4">
              {t("community.confirmTitle")}
            </h3>

            <p className="mb-6">
              {t("community.confirmText", { package: selectedPackage })}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleJoin}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg"
              >
                {t("common.yes")}
              </button>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2 bg-gray-400 text-white rounded-lg"
              >
                {t("common.no")}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DirectSellingPage;