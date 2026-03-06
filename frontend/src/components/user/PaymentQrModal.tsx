import React, { useState } from "react";

interface PaymentQrModalProps {
  visible: boolean;
  onClose: () => void;
  amount?: number; 
  qrImage?: string; 
}

const PaymentQrModal: React.FC<PaymentQrModalProps> = ({
  visible,
  onClose,
  amount = 50,
  qrImage = "/qr-code.png",
}) => {
  const [screenshot, setScreenshot] = useState<File | null>(null);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
      console.log("Uploaded screenshot:", e.target.files[0]);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Scan to Pay ₹{amount}</h2>

        <img
          src={qrImage}
          alt={`Static QR Code for ₹${amount}`}
          className="mx-auto w-64 h-64"
        />
        <p className="mt-2 text-gray-700 mb-4">
          Use GPay, PhonePe, Paytm, or any UPI app to scan.
        </p>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Upload Screenshot (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleScreenshotUpload}
            className="border rounded px-3 py-2 w-full"
          />
          {screenshot && (
            <p className="mt-2 text-green-600 text-sm">
              Uploaded: {screenshot.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentQrModal;