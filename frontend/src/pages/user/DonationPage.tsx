import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { createPayment, getUpiDetails , confirmPayment } from "../../services/user/paymentService";
import {
  joinCommunity,
  getCommunityStatus
} from "../../services/user/profileService";
import { uploadPaymentScreenshot } from "../../services/user/paymentService";

const DonationPage: React.FC = () => {
  const { t } = useTranslation();

  const [amount, setAmount] = useState<number | null>(null);
  const [paymentId, setPaymentId] = useState("");

  const [payTarget, setPayTarget] = useState<"coordinator" | "admin">("coordinator");

  const [coordinatorUpi, setCoordinatorUpi] = useState("");
  const [adminUpi, setAdminUpi] = useState("");

  const [joined, setJoined] = useState(false);

  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [selectedPackage, setSelectedPackage] = useState("Elements Unity");

  const amounts = [50,100,200,300,400,500,600,700,800,900,1000];

  const [showPaymentConfirm, setShowPaymentConfirm] = useState(false);
const [showScreenshotUpload, setShowScreenshotUpload] = useState(false);

const [screenshotFile, setScreenshotFile] = useState<File | null>(null);

  // fetch UPI ids
  useEffect(() => {
    const fetchUpi = async () => {
      try {
        const data = await getUpiDetails();
        setCoordinatorUpi(data.coordinatorUpi);
        setAdminUpi(data.adminUpi);
      } catch (error) {
        console.error("Failed to fetch UPI details", error);
      }
    };

    fetchUpi();
  }, []);

  const handleCreatePayment = async () => {
  try {
    if (!amount) return;

    const upiId =
      payTarget === "coordinator"
        ? coordinatorUpi
        : adminUpi;

    const name = "Unity Darmarpan";
    const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

    const data = await createPayment({
      amount,
      paidTo: payTarget
    });

    setPaymentId(data.paymentId);

    // open UPI
    window.location.href = upiLink;

    // show confirm modal
    setTimeout(() => {
      setShowPaymentConfirm(true);
    }, 2000);

  } catch (error) {
    console.error("Payment creation failed:", error);
  }
};
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setScreenshotFile(file);
};

const handleUploadScreenshot = async () => {
  if (!screenshotFile) {
    alert("Please select a screenshot first");
    return;
  }

  try {
    await uploadPaymentScreenshot(screenshotFile, paymentId);
    alert("Screenshot uploaded successfully");

    setShowScreenshotUpload(false);
    setScreenshotFile(null);

  } catch (error) {
    console.error("Upload failed:", error);
    alert("Failed to upload screenshot");
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-200 px-4 py-12">

      {/* Donation Card */}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          {t("donation.title")}
        </h1>

        <p className="text-center text-gray-500 mb-6">
          {t("donation.description")}
        </p>

        {/* Payment Target */}

        <div className="flex justify-center gap-6 mb-6">

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="coordinator"
              checked={payTarget === "coordinator"}
              onChange={() => setPayTarget("coordinator")}
            />
            Pay under Coordinator
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="admin"
              checked={payTarget === "admin"}
              onChange={() => setPayTarget("admin")}
            />
            Pay under Admin
          </label>

        </div>

        {/* Amount Buttons */}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">

          {amounts.map((value) => (

            <button
              key={value}
              onClick={() => setAmount(value)}
              className={`px-4 py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                amount === value
                  ? "bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-lg"
                  : "bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200"
              }`}
            >
              ₹{value}
            </button>

          ))}

        </div>

        {/* Pay Button */}

        <button
          onClick={handleCreatePayment}
          disabled={!amount}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
            amount
              ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {amount ? `Pay ₹${amount}` : t("donation.pay")}
        </button>

      </div>

      {/* Community Section */}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-6 text-center">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t("community.title")}
        </h2>

        {joined ? (

          <p className="text-green-600 font-semibold text-lg">
            {t("community.joined")}
          </p>

        ) : (

          <button
            onClick={handleViewPackage}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700"
          >
            {t("community.viewPackage")}
          </button>

        )}

      </div>

      {/* Package Modal */}

      {showPackageModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

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

      {/* Confirmation Modal */}

      {showConfirmModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

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
  {/* Payment Confirmation Modal */}

{showPaymentConfirm && (

  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-96 text-center">

      <h3 className="text-xl font-bold mb-4">
        {t("payment.confirmTitle")}
      </h3>

      <div className="flex justify-center gap-4">

       <button
  onClick={async () => {
    try {

      await confirmPayment(paymentId);

      setShowPaymentConfirm(false);
      setShowScreenshotUpload(true);

    } catch (error) {
      console.error("Failed to confirm payment", error);
    }
  }}
  className="px-5 py-2 bg-green-600 text-white rounded-lg"
>
  {t("payment.yesCompleted")}
</button>

        <button
          onClick={() => {

            const upiId =
              payTarget === "coordinator"
                ? coordinatorUpi
                : adminUpi;

            const name = "Unity Darmarpan";

            const upiLink = `upi://pay?pa=${upiId}&pn=${name}&am=${amount}&cu=INR`;

            window.location.href = upiLink;

          }}
          className="px-5 py-2 bg-orange-500 text-white rounded-lg"
        >
          {t("payment.tryAgain")}
        </button>

      </div>

    </div>

  </div>

)}



{/* Screenshot Upload Modal */}

{showScreenshotUpload && (

  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-96 relative">

      {/* Close Button */}

      <button
        onClick={() => {
          setShowScreenshotUpload(false);
          setScreenshotFile(null);
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
      >
        {t("common.close")}
      </button>

      <h3 className="text-xl font-bold mb-4 text-center">
        {t("payment.uploadScreenshot")}
      </h3>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-4 w-full"
      />

      <button
        onClick={handleUploadScreenshot}
        className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2"
      >
        {t("payment.upload")}
      </button>

      {/* Skip Button */}

      <button
        onClick={() => {
          setShowScreenshotUpload(false);
          setScreenshotFile(null);
        }}
        className="w-full bg-gray-400 text-white py-2 rounded-lg"
      >
        {t("payment.skip")}
      </button>

    </div>

  </div>

)}
    </div>
  );
};

export default DonationPage;