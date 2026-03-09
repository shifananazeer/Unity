import React, { useState } from "react";
import PaymentQrModal from "../../components/user/PaymentQrModal";
import { useTranslation } from "react-i18next";
import { createPayment } from "../../services/user/paymentService";

const DonationPage: React.FC = () => {
  const { t } = useTranslation();

  const [amount, setAmount] = useState<number | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [paymentId, setPaymentId] = useState<string>("");

  const amounts = [50, 100, 200, 300, 400, 500];

  const handleCreatePayment = async () => {
    console.log("handle payment")
  try {
    if (!amount) return;

    const data = await createPayment(amount);
  setPaymentId(data.paymentId);
 console.log("Payment created:", data);
    setShowQr(true);

  } catch (error) {
    console.error("Payment creation failed:", error);
  }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-orange-200 px-4 py-12">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          {t("donation.title")}
        </h1>

        <p className="text-center text-gray-500 mb-10">
          {t("donation.description")}
        </p>

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

      <PaymentQrModal
        visible={showQr}
         onClose={() => {
       setShowQr(false);     
       setAmount(null);    
       setPaymentId("");     
      }}
        amount={amount || 0}
        qrImage="/qr-code.png"
         paymentId={paymentId}
      />

    </div>
  );
};

export default DonationPage;