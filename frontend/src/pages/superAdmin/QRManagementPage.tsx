import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { uploadQRCode, getLatestQRCode } from "../../services/superAdmin/authService"

interface QRData {
  imageUrl: string;
  amount: number;
}

const API_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = API_URL.replace("/api", "");


const QrManagementPage: React.FC = () => {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [amount, setAmount] = useState<number>(50);
  const [loading, setLoading] = useState(false);

  const fetchQR = async () => {
    try {
      const data = await getLatestQRCode();
      setQrData(data);
      setAmount(data.amount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchQR();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "Upload QR Image",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      setLoading(true);

      await uploadQRCode(file, amount);

      Swal.fire({
        icon: "success",
        title: "QR Code Updated",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });

      setFile(null);
      fetchQR();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Could not update QR code",
        toast: true,
        position: "top-end",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">QR Code Management</h1>

      {/* Current QR */}
      <div className="bg-white shadow rounded-lg p-5 mb-6">
        <h2 className="font-medium mb-3">Current QR Code</h2>

        {qrData ? (
          <div className="text-center">
        <img
  src={`${BASE_URL}${qrData.imageUrl}`}
  alt="Current QR"
  className="w-64 h-64 mx-auto border rounded"
/>
            <p className="mt-2 text-gray-600">
              Payment Amount: <b>₹{qrData.amount}</b>
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No QR uploaded yet</p>
        )}
      </div>

      {/* Upload New QR */}
      <div className="bg-white shadow rounded-lg p-5">
        <h2 className="font-medium mb-4">Upload New QR Code</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Upload QR Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(e.target.files ? e.target.files[0] : null)
            }
            className="border rounded px-3 py-2 w-full"
          />

          {file && (
            <p className="text-green-600 text-sm mt-1">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Payment Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Uploading..." : "Update QR Code"}
        </button>
      </div>
    </div>
  );
};

export default QrManagementPage;