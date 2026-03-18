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

        <h2 className="text-2xl font-bold mb-4">
          RD Community
        </h2>

        {joined ? (
          <p className="text-green-600 font-semibold">
            Joined successfully
          </p>
        ) : (
          <button
            onClick={handleViewPackage}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg"
          >
            View Packages
          </button>
        )}

      </div>

      {/* Package Modal */}
      {showPackageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded-xl w-96">

            <h3 className="text-xl font-bold mb-4">
              Select RD Package
            </h3>

            <label className="flex gap-2 mb-3">
              <input
                type="radio"
                value="Basic RD"
                checked={selectedPackage === "Basic RD"}
                onChange={(e) => setSelectedPackage(e.target.value)}
              />
              Basic RD
            </label>

            <label className="flex gap-2 mb-3">
              <input
                type="radio"
                value="Premium RD"
                checked={selectedPackage === "Premium RD"}
                onChange={(e) => setSelectedPackage(e.target.value)}
              />
              Premium RD
            </label>

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setShowPackageModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded"
              >
                Join
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
              Confirm Join
            </h3>

            <p className="mb-4">
              Are you ready to join {selectedPackage}?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={handleJoin}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Yes
              </button>

              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                No
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default RDCommunityPage;