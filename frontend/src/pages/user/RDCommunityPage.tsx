import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { joinRD, getRDStatus } from "../../services/user/authService";

const RDCommunityPage: React.FC = () => {
  const { t } = useTranslation();

  const [joined, setJoined] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("Basic RD");

  const handleViewPackage = async () => {
    const status = await getRDStatus();
    setJoined(status.joined);

    if (!status.joined) {
      setShowPackageModal(true);
    }
  };

  const handleJoin = async () => {
    await joinRD(selectedPackage);

    setJoined(true);
    setShowConfirmModal(false);
    setShowPackageModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{t("rdCommunity.title")}</h2>

        {joined ? (
          <p className="text-green-600 font-semibold">
            {t("rdCommunity.joinedSuccess")}
          </p>
        ) : (
          <button
            onClick={handleViewPackage}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg"
          >
            {t("rdCommunity.viewPackages")}
          </button>
        )}
      </div>

      {/* Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="text-xl font-bold mb-4">
              {t("rdCommunity.selectPackage")}
            </h3>

            <label className="flex gap-2 mb-3">
              <input
                type="radio"
                value="Basic RD"
                checked={selectedPackage === "Basic RD"}
                onChange={(e) => setSelectedPackage(e.target.value)}
              />
              {t("rdCommunity.basicRD")}
            </label>

            <label className="flex gap-2 mb-3">
              <input
                type="radio"
                value="Premium RD"
                checked={selectedPackage === "Premium RD"}
                onChange={(e) => setSelectedPackage(e.target.value)}
              />
              {t("rdCommunity.premiumRD")}
            </label>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowPackageModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                {t("common.cancel")}
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                {t("common.join")}
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
              {t("rdCommunity.confirmJoin")}
            </h3>

            <p className="mb-4">
              {t("rdCommunity.confirmMessage", { package: selectedPackage })}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleJoin}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {t("common.yes")}
              </button>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
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

export default RDCommunityPage;