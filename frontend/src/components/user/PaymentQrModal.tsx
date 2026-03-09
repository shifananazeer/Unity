import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { uploadPaymentScreenshot } from "../../services/user/paymentService";

interface PaymentQrModalProps {
  visible: boolean;
  onClose: () => void;
  amount?: number;
  qrImage?: string;
  paymentId?: string; 
}

const PaymentQrModal: React.FC<PaymentQrModalProps> = ({
  visible,
  onClose,
  amount = 50,
  qrImage = "/qr-code.png",
  paymentId
}) => {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };

 const handleSubmit = async () => {
  if (!screenshot) {
    Swal.fire({
      icon: "warning",
      title: "Upload Screenshot",
      text: "Please upload payment screenshot",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
    return;
  }

  try {
    setLoading(true);

    await uploadPaymentScreenshot(screenshot , paymentId || "" ); // pass paymentId to service

    Swal.fire({
      icon: "success",
      title: "Payment Proof Submitted",
      timer: 1500,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });

    onClose();
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Upload Failed",
      text: "Failed to upload screenshot",
      timer: 2000,
      showConfirmButton: false,
      toast: true,
      position: "top-end",
    });
  } finally {
    setLoading(false);
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
          alt={`QR Code for ₹${amount}`}
          className="mx-auto w-64 h-64"
        />

        <p className="mt-2 text-gray-700 mb-4">
          Use GPay, PhonePe, Paytm, or any UPI app to scan.
        </p>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Upload Screenshot
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

        {/* Submit Button */}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Submitting..." : "Submit Payment Proof"}
        </button>
      </div>
    </div>
  );
};

export default PaymentQrModal;